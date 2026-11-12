import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  LoaderCircle,
  Plus,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import { adminApiRequest } from "../../services/adminApi";

const EMPTY_SCHEMAS = {};
const EMPTY_CONTENT = {};
const ADMIN_TAGS = new Set([
  "11 | Admin jobs & charging",
  "12 | Admin fleet vehicles",
  "13 | Admin fleet chargers",
  "14 | Admin charger connectors",
  "15 | Admin vehicle-charger pairings",
  "16 | Admin RBAC",
  "17 | Admin Zones",
  "18 | Admin Zone assignments",
  "19 | Admin Zone GST",
  "20 | Admin Zone tariffs",
  "21 | Admin Zone simulation",
  "24 | Admin commercial tariffs",
  "25 | Admin commercial GST",
  "26 | Admin commercial groups",
  "27 | Admin commercial assignments",
  "28 | Admin commercial preview",
  "29 | Admin customers",
  "30 | Admin drivers",
  "31 | Driver recruitment",
  "32 | Admin Driver recruitment",
]);

function resolveSchema(schema, schemas, depth = 0) {
  if (!schema || depth > 8) return {};
  if (schema.$ref) {
    return resolveSchema(schemas?.[schema.$ref.split("/").pop()], schemas, depth + 1);
  }
  if (schema.allOf) {
    return schema.allOf.reduce((combined, part) => {
      const resolved = resolveSchema(part, schemas, depth + 1);
      return {
        ...combined,
        ...resolved,
        properties: { ...combined.properties, ...resolved.properties },
        required: [...(combined.required || []), ...(resolved.required || [])],
      };
    }, { ...schema, properties: {}, required: [] });
  }
  if (schema.oneOf || schema.anyOf) {
    return resolveSchema((schema.oneOf || schema.anyOf)[0], schemas, depth + 1);
  }
  return schema;
}

function fieldLabel(name, schema = {}) {
  if (schema.title) return schema.title;
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function operationLabel(operation) {
  const summary = operation.summary || operation.description?.split(/[.!?]/)[0] || "View details";
  const actionLabels = [
    [/^Submit start\b/i, "Start"],
    [/^Submit approve\b/i, "Approve"],
    [/^Submit reject\b/i, "Reject"],
    [/^Submit begin\b/i, "Begin"],
    [/^Submit complete\b/i, "Complete"],
    [/^Submit end\b/i, "End"],
    [/^Submit close\b/i, "Close"],
    [/^Submit activate\b/i, "Activate"],
    [/^Submit publish\b/i, "Publish"],
    [/^Submit retire\b/i, "Retire"],
    [/^Submit assign\b/i, "Assign"],
    [/^Submit remove\b/i, "Remove"],
    [/^Submit review\b/i, "Review"],
    [/^Submit withdraw\b/i, "Withdraw"],
    [/^Submit request action\b/i, "Request an update"],
  ];
  for (const [pattern, label] of actionLabels) {
    if (pattern.test(summary)) return summary.replace(pattern, label);
  }
  return summary
    .replace(/^Get\b/i, "View")
    .replace(/^Read\b/i, "View")
    .replace(/^List\b/i, "View")
    .replace(/^Submit duplicate and assign\b/i, "Create a copy and assign")
    .replace(/^Submit duplicate\b/i, "Create a copy")
    .replace(/^Submit preview\b/i, "Preview settings")
    .replace(/^Submit\b/i, "Save");
}

function initializeFields(schema, schemas, depth = 0) {
  const resolved = resolveSchema(schema, schemas);
  if (depth > 8) return "";
  if (resolved.type === "object" || resolved.properties) {
    return Object.fromEntries(
      Object.entries(resolved.properties || {}).map(([name, property]) => [
        name,
        initializeFields(property, schemas, depth + 1),
      ]),
    );
  }
  if (resolved.type === "array") return [];
  if (resolved.type === "boolean") {
    return resolved.default ?? (resolved.required ? false : null);
  }
  if (resolved.default !== undefined) return resolved.default;
  return "";
}

function setAtPath(value, path, nextValue) {
  if (!path.length) return nextValue;
  const [key, ...remaining] = path;
  if (Array.isArray(value)) {
    const copy = [...value];
    copy[key] = setAtPath(copy[key], remaining, nextValue);
    return copy;
  }
  return {
    ...(value || {}),
    [key]: setAtPath(value?.[key], remaining, nextValue),
  };
}

function cleanValue(value, schema, schemas, depth = 0) {
  const resolved = resolveSchema(schema, schemas);
  if (depth > 8 || value === null || value === undefined || value === "") return undefined;
  if (resolved.type === "object" || resolved.properties) {
    const result = {};
    for (const [name, property] of Object.entries(resolved.properties || {})) {
      const clean = cleanValue(value?.[name], property, schemas, depth + 1);
      if (clean !== undefined) result[name] = clean;
    }
    return result;
  }
  if (resolved.type === "array") {
    return (Array.isArray(value) ? value : [])
      .map((item) => cleanValue(item, resolved.items, schemas, depth + 1))
      .filter((item) => item !== undefined);
  }
  if (resolved.type === "integer" || resolved.type === "number") {
    if (value === "") return undefined;
    return Number(value);
  }
  return value;
}

function pathParameters(path) {
  return [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
}

function describeError(error) {
  if (error.code === "SESSION_EXPIRED") return `${error.message} Sign in again to continue.`;
  if (error.status === 409 || error.status === 412) {
    return `${error.message} This record may have changed. Refresh it before trying again.`;
  }
  return error.message || "The action could not be completed.";
}

function TextControl({ schema, value, onChange, required, disabled }) {
  const inputType = schema.format === "date"
    ? "date"
    : schema.format === "date-time"
      ? "datetime-local"
      : schema.format === "email"
        ? "email"
        : schema.format === "uri"
          ? "url"
          : schema.format === "binary"
            ? "file"
            : ["integer", "number"].includes(schema.type)
              ? "number"
              : "text";
  const options = schema.enum || (schema.const !== undefined ? [schema.const] : null);
  const commonClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100";

  if (options) {
    return (
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={required} disabled={disabled} className={commonClass}>
        <option value="">Choose an option</option>
        {options.map((option) => <option key={option} value={option}>{String(option).replaceAll("_", " ")}</option>)}
      </select>
    );
  }
  if (schema.type === "boolean") {
    return (
      <select
        value={value === true ? "true" : value === false ? "false" : ""}
        onChange={(event) => onChange(event.target.value === "" ? null : event.target.value === "true")}
        required={required}
        disabled={disabled}
        className={commonClass}
      >
        {!required && <option value="">Use default</option>}
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    );
  }
  if (inputType === "file") {
    return <input type="file" required={required} disabled={disabled} onChange={(event) => onChange(event.target.files?.[0] || null)} className={commonClass} />;
  }
  if (schema.format === "date-time" && value && !String(value).includes("T")) {
    value = `${value}T00:00`;
  }
  return (
    <input
      type={inputType}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      disabled={disabled}
      minLength={schema.minLength}
      maxLength={schema.maxLength}
      min={schema.minimum}
      max={schema.maximum}
      step={schema.type === "integer" ? 1 : schema.type === "number" ? "any" : undefined}
      placeholder={schema.examples?.[0] || ""}
      className={commonClass}
    />
  );
}

function SchemaFields({
  schema,
  schemas,
  values,
  onChange,
  required = false,
  disabled = false,
  files,
  setFiles,
  path = [],
  depth = 0,
}) {
  const resolved = resolveSchema(schema, schemas);
  if (depth > 6) return null;

  if (resolved.type === "object" || resolved.properties) {
    const requiredFields = new Set(resolved.required || []);
    const entries = Object.entries(resolved.properties || {});
    if (entries.length === 0) return null;
    return (
      <div className={depth ? "grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2"}>
        {entries.map(([name, childSchema]) => (
          <div key={name} className={childSchema.type === "object" ? "sm:col-span-2" : ""}>
            <SchemaFields
              schema={childSchema}
              schemas={schemas}
              values={values?.[name]}
              onChange={(next) => onChange(setAtPath(values || {}, [name], next))}
              required={requiredFields.has(name)}
              disabled={disabled}
              files={files}
              setFiles={setFiles}
              path={[...path, name]}
              depth={depth + 1}
            />
          </div>
        ))}
      </div>
    );
  }

  const label = fieldLabel(path[path.length - 1] || "Value", resolved);
  const description = resolved.description;
  const isArray = resolved.type === "array";
  const isFile = resolved.format === "binary";
  const currentValue = isFile ? files?.[path.join(".")] : values;
  const commonLabel = (
    <span className="text-xs font-bold text-slate-700">
      {label}{required && <span className="ml-1 text-rose-600" aria-label="required">*</span>}
    </span>
  );

  if (isArray) {
    const items = Array.isArray(values) ? values : [];
    const itemSchema = resolveSchema(resolved.items, schemas);
    return (
      <fieldset className="space-y-2 rounded-lg border border-slate-200 p-3">
        <legend className="px-1">{commonLabel}</legend>
        {description && <p className="text-xs text-slate-500">{description}</p>}
        {items.map((item, index) => (
          <div key={`${path.join(".")}-${index}`} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <SchemaFields
                schema={itemSchema}
                schemas={schemas}
                values={item}
                required={(resolved.minItems || 0) > index}
                disabled={disabled}
                files={files}
                setFiles={setFiles}
                path={[...path, index]}
                depth={depth + 1}
                onChange={(next) => {
                  const updated = [...items];
                  updated[index] = next;
                  onChange(updated);
                }}
              />
            </div>
            <button type="button" disabled={disabled || items.length <= (resolved.minItems || 0)} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${label}`} className="mt-1 rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled || items.length >= (resolved.maxItems || 100)}
          onClick={() => onChange([...items, initializeFields(itemSchema, schemas)])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Plus size={14} /> Add {fieldLabel("item")}
        </button>
      </fieldset>
    );
  }

  return (
    <label className="grid gap-1.5">
      {commonLabel}
      <TextControl
        schema={resolved}
        value={currentValue}
        required={required}
        disabled={disabled}
        onChange={(next) => {
          if (isFile) {
            setFiles((previous) => ({ ...previous, [path.join(".")]: next }));
          } else {
            onChange(next);
          }
        }}
      />
      {description && <span className="text-[11px] leading-4 text-slate-500">{description}</span>}
    </label>
  );
}

function ResultView({ value, depth = 0 }) {
  if (value === null || value === undefined) {
    return <p className="text-sm text-slate-500">No information to show.</p>;
  }
  if (typeof value !== "object") {
    return <span className="break-words text-sm text-slate-700">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (!value.length) return <p className="text-sm text-slate-500">No records found.</p>;
    if (depth > 3) return <span className="text-sm text-slate-500">{value.length} items</span>;
    return (
      <div className="grid gap-2">
        {value.map((item, index) => (
          <article key={item?.id || item?.key || index} className="rounded-lg border border-slate-200 bg-white p-3">
            <ResultView value={item} depth={depth + 1} />
          </article>
        ))}
      </div>
    );
  }
  const entries = Object.entries(value).filter(([, child]) => child !== null && child !== undefined);
  return (
    <dl className={depth ? "grid gap-2 sm:grid-cols-2" : "grid gap-2 sm:grid-cols-2"}>
      {entries.map(([key, child]) => (
        <div key={key} className="min-w-0 rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{fieldLabel(key)}</dt>
          <dd className="mt-1 break-words">
            {typeof child === "object"
              ? <ResultView value={child} depth={depth + 1} />
              : <span className="text-sm text-slate-700">{String(child)}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function AdminApiWorkspace({
  title = "Administration",
  description = "Manage operational and commercial settings.",
  tags,
}) {
  const [spec, setSpec] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loadingSpec, setLoadingSpec] = useState(true);
  const [selectedTag, setSelectedTag] = useState(tags?.[0] || "");
  const [selectedOperationKey, setSelectedOperationKey] = useState("");
  const [pathValues, setPathValues] = useState({});
  const [queryValues, setQueryValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [files, setFiles] = useState({});
  const [recordVersion, setRecordVersion] = useState("");
  const [result, setResult] = useState(null);
  const [resultKind, setResultKind] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [busy, setBusy] = useState(false);
  const [download, setDownload] = useState(null);

  const loadSpec = useCallback(async () => {
    setLoadingSpec(true);
    setLoadError("");
    try {
      const response = await adminApiRequest("/api/openapi.json", { auth: false });
      setSpec(response.data);
    } catch (error) {
      setLoadError(`Could not load this page. ${error.message}`);
    } finally {
      setLoadingSpec(false);
    }
  }, []);

  useEffect(() => {
    loadSpec();
  }, [loadSpec]);

  const availableTags = useMemo(
    () => (spec?.tags || [])
      .map((tag) => tag.name)
      .filter((name) => ADMIN_TAGS.has(name))
      .filter((name) => !tags || tags.includes(name)),
    [spec, tags],
  );

  useEffect(() => {
    if (availableTags.length && !availableTags.includes(selectedTag)) {
      setSelectedTag(availableTags[0]);
    }
  }, [availableTags, selectedTag]);

  const schemas = spec?.components?.schemas || EMPTY_SCHEMAS;
  const operations = useMemo(() => {
    if (!spec || !selectedTag) return [];
    return Object.entries(spec.paths || {}).flatMap(([path, pathItem]) =>
      Object.entries(pathItem)
        .filter(([method, operation]) =>
          ["get", "post", "put", "patch", "delete"].includes(method.toLowerCase()) &&
          operation.tags?.includes(selectedTag),
        )
        .map(([method, operation]) => ({
          key: `${method.toUpperCase()} ${path}`,
          path,
          method: method.toUpperCase(),
          operation,
        })),
    );
  }, [selectedTag, spec]);

  useEffect(() => {
    if (operations.length && !operations.some((operation) => operation.key === selectedOperationKey)) {
      setSelectedOperationKey(operations[0].key);
    }
  }, [operations, selectedOperationKey]);

  const current = operations.find((operation) => operation.key === selectedOperationKey);
  const parameters = useMemo(() => current?.operation.parameters || [], [current]);
  const pathNames = useMemo(
    () => current ? pathParameters(current.path) : [],
    [current],
  );
  const headerParameters = useMemo(
    () => parameters.filter((parameter) => parameter.in === "header"),
    [parameters],
  );
  const queryParameters = useMemo(
    () => parameters.filter((parameter) => parameter.in === "query"),
    [parameters],
  );
  const content = current?.operation.requestBody?.content || EMPTY_CONTENT;
  const mediaType = useMemo(
    () => Object.keys(content).find((type) =>
      ["application/json", "multipart/form-data"].includes(type),
    ),
    [content],
  );
  const formSchema = useMemo(
    () => resolveSchema(content[mediaType]?.schema, schemas),
    [content, mediaType, schemas],
  );
  const formRequired = Boolean(mediaType);
  const isReadOnly = current?.method === "GET";
  const isHalCommand = current?.path.endsWith("/charging/start");
  const isNonbinding = current?.path.includes("/preview");

  useEffect(() => {
    setPathValues(Object.fromEntries(pathNames.map((name) => [name, ""])));
    setQueryValues(Object.fromEntries(queryParameters.map((parameter) => [
      parameter.name,
      parameter.schema?.default ?? "",
    ])));
    setFormValues(formSchema ? initializeFields(formSchema, schemas) : {});
    setFiles({});
    setRecordVersion("");
    setRequestError("");
    setResult(null);
    setResultKind("");
    setResultMessage("");
    setDownload(null);
  }, [current?.key, formSchema, pathNames, queryParameters, schemas]);

  useEffect(() => () => {
    if (download?.url) URL.revokeObjectURL(download.url);
  }, [download]);

  function setPathValue(name, value) {
    setPathValues((previous) => ({ ...previous, [name]: value }));
  }

  function setQueryValue(name, value) {
    setQueryValues((previous) => ({ ...previous, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!current || busy) return;
    setRequestError("");
    setDownload(null);

    const missingPath = pathNames.find((name) => !String(pathValues[name] || "").trim());
    if (missingPath) {
      setRequestError(`Enter ${fieldLabel(missingPath)} to continue.`);
      return;
    }
    const missingQuery = queryParameters.find((parameter) =>
      parameter.required && !String(queryValues[parameter.name] ?? "").trim(),
    );
    if (missingQuery) {
      setRequestError(`Enter ${fieldLabel(missingQuery.name)} to continue.`);
      return;
    }
    if (headerParameters.some((parameter) => parameter.name.toLowerCase() === "if-match") && !recordVersion.trim()) {
      setRequestError("Enter the latest record version to save this change.");
      return;
    }

    const actionLabel = operationLabel(current.operation);
    if (!isReadOnly && !window.confirm(`${actionLabel}\n\nDo you want to continue?`)) return;

    let requestPath = current.path.replace(/\{([^}]+)\}/g, (_, name) =>
      encodeURIComponent(String(pathValues[name]).trim()),
    );
    const query = new URLSearchParams();
    for (const parameter of queryParameters) {
      const value = queryValues[parameter.name];
      if (value !== undefined && value !== null && String(value).trim()) {
        query.set(parameter.name, String(value).trim());
      }
    }
    if (query.size) requestPath += `?${query.toString()}`;

    const headers = {};
    for (const parameter of headerParameters) {
      const name = parameter.name.toLowerCase();
      if (name === "idempotency-key") {
        headers[parameter.name] =
          globalThis.crypto?.randomUUID?.() ||
          "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
            const random = Math.floor(Math.random() * 16);
            return (character === "x" ? random : (random & 0x3) | 0x8).toString(16);
          });
      } else if (name === "if-match") {
        headers[parameter.name] = recordVersion.trim().startsWith('"')
          ? recordVersion.trim()
          : `"${recordVersion.trim()}"`;
      }
    }

    let requestBody;
    if (mediaType === "multipart/form-data") {
      const formData = new FormData();
      for (const [key, value] of Object.entries(cleanValue(formValues, formSchema, schemas) || {})) {
        const file = files[key];
        formData.append(key, file || (typeof value === "string" ? value : JSON.stringify(value)));
      }
      for (const [key, file] of Object.entries(files)) {
        if (file && !formData.has(key)) formData.append(key, file);
      }
      const missingFile = Object.entries(formSchema.properties || {}).find(
        ([key, property]) => property.format === "binary" && formSchema.required?.includes(key) && !files[key],
      );
      if (missingFile) {
        setRequestError(`Choose a file for ${fieldLabel(missingFile[0], missingFile[1])}.`);
        return;
      }
      requestBody = formData;
    } else if (mediaType) {
      requestBody = cleanValue(formValues, formSchema, schemas) || {};
    }

    setBusy(true);
    try {
      const response = await adminApiRequest(requestPath, {
        method: current.method,
        body: requestBody,
        headers,
        responseType: current.path.endsWith("/download") ? "blob" : "json",
      });
      const etag = response.headers.get("etag");
      if (etag) setRecordVersion(etag);
      if (response.data instanceof Blob) {
        const url = URL.createObjectURL(response.data);
        const filename = response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/i)?.[1];
        setDownload({ url, filename: filename || "download" });
        setResultMessage("Your file is ready.");
        setResultKind("success");
        setResult(null);
      } else {
        setResult(response.data);
        setResultKind("success");
        setResultMessage(isReadOnly ? "Information loaded." : "Your changes have been saved.");
      }
      if (response.status === 204) {
        setResult(null);
        setResultMessage("Your changes have been saved.");
      }
    } catch (error) {
      setRequestError(describeError(error));
      setResultKind("error");
      if (error.status === 401) {
        window.setTimeout(() => window.location.assign("/login"), 1200);
      }
    } finally {
      setBusy(false);
    }
  }

  const tagLabel = (tag) => tag.replace(/^\d+\s*\|\s*Admin\s*/, "");

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p>
        </div>
        <button
          type="button"
          onClick={loadSpec}
          disabled={loadingSpec}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loadingSpec ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          {availableTags.length > 1 && (
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Section
              <select value={selectedTag} onChange={(event) => setSelectedTag(event.target.value)} disabled={loadingSpec} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
                {availableTags.map((tag) => <option key={tag} value={tag}>{tagLabel(tag)}</option>)}
              </select>
            </label>
          )}
          <label className={`grid gap-1.5 text-sm font-semibold text-slate-700 ${availableTags.length <= 1 ? "md:col-span-2" : ""}`}>
            What would you like to do?
            <select value={selectedOperationKey} onChange={(event) => setSelectedOperationKey(event.target.value)} disabled={!operations.length} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
              {operations.map((operation) => (
                <option key={operation.key} value={operation.key}>
                  {operationLabel(operation.operation)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loadingSpec && <p className="mt-4 text-sm text-slate-500">Loading available actions…</p>}
        {loadError && <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle size={17} className="mt-0.5 shrink-0" />{loadError}</div>}

        {current && (
          <>
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <p className="text-sm font-bold text-slate-800">{operationLabel(current.operation)}</p>
            </div>
            {isHalCommand && <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">A request can be accepted before the charging operation physically begins.</div>}
            {isNonbinding && <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">This is an estimate or preview only. It does not create a customer quote or payment.</div>}

            <form onSubmit={submit} className="mt-5 space-y-5">
              {pathNames.length > 0 && (
                <fieldset className="grid gap-3 sm:grid-cols-2">
                  <legend className="mb-2 text-sm font-bold text-slate-800">Record details</legend>
                  {pathNames.map((name) => (
                    <label key={name} className="grid gap-1.5 text-xs font-bold text-slate-700">
                      {fieldLabel(name)} <span className="font-normal text-slate-500">Required</span>
                      <input required value={pathValues[name] || ""} onChange={(event) => setPathValue(name, event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                    </label>
                  ))}
                </fieldset>
              )}

              {queryParameters.length > 0 && (
                <fieldset className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <legend className="mb-2 text-sm font-bold text-slate-800">Filters</legend>
                  {queryParameters.map((parameter) => (
                    <SchemaFields
                      key={parameter.name}
                      schema={parameter.schema}
                      schemas={schemas}
                      values={queryValues[parameter.name]}
                      onChange={(value) => setQueryValue(parameter.name, value)}
                      required={parameter.required}
                      disabled={busy}
                      path={[parameter.name]}
                    />
                  ))}
                </fieldset>
              )}

              {headerParameters.some((parameter) => parameter.name.toLowerCase() === "if-match") && (
                <label className="grid max-w-xl gap-1.5 text-xs font-bold text-slate-700">
                  Current record version <span className="font-normal text-slate-500">Use the version shown in the record details</span>
                  <input required value={recordVersion} onChange={(event) => setRecordVersion(event.target.value)} placeholder="Enter the latest version" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
                </label>
              )}

              {formRequired && Object.keys(formSchema.properties || {}).length > 0 && (
                <fieldset className="space-y-3">
                  <legend className="mb-2 text-sm font-bold text-slate-800">{isReadOnly ? "Search details" : "Details"}</legend>
                  <SchemaFields
                    schema={formSchema}
                    schemas={schemas}
                    values={formValues}
                    onChange={setFormValues}
                    disabled={busy}
                    files={files}
                    setFiles={setFiles}
                  />
                </fieldset>
              )}

              {requestError && <div role="alert" className="flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span>{requestError}</span></div>}

              <button type="submit" disabled={busy || loadingSpec || Boolean(loadError)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
                {busy ? "Please wait…" : isReadOnly ? "Load information" : "Save changes"}
              </button>
            </form>
          </>
        )}
      </section>

      {(resultMessage || resultKind === "error") && (
        <section className={`rounded-xl border p-4 shadow-sm ${resultKind === "error" ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"}`}>
          <div className="flex items-center gap-2 text-sm font-bold">
            {resultKind === "error" ? <AlertCircle size={17} className="text-rose-700" /> : <CheckCircle2 size={17} className="text-emerald-700" />}
            <span className={resultKind === "error" ? "text-rose-800" : "text-emerald-800"}>{resultMessage || "Something went wrong."}</span>
          </div>
          {result !== null && <div className="mt-3"><ResultView value={result} /></div>}
          {download && (
            <a href={download.url} download={download.filename} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
              <ArrowDownToLine size={15} /> Download file
            </a>
          )}
        </section>
      )}
    </main>
  );
}
