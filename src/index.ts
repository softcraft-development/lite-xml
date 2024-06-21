import * as ty from "typonomy"

/**
 * A key-value map of attributes.
 */
export type Attributes = Record<string, ty.Possible<string>>

export interface Doc {
  dtd?: string
  encoding?: string
  internalDTD?: string
  root: Element
  version?: string
}

/**
 * Represents an XML element.
 */
export interface Element {
  attributes?: Attributes
  children?: ty.Some<Node>
  name: string
}

/**
 * An XML Node, which may be either an Element or a string.
 */
export type Node = Element | string

/**
 * Renders a collection of Attributes as a string.
 *
 * @param attributes - The attributes object to convert.
 * @returns The string representation of the attributes.
 */
export function attributesToString(attributes: Attributes): string {
  return ty.reduce(attributes, (array: string[], value: ty.Possible<string>, key: string) => {
    if (ty.isExplicit(value)) {
      array.push(`${key}="${value.replace("\"", "&quot;")}"`)
    }
    else {
      array.push(key)
    }
    return array
  }, []).join(" ")
}

/**
 * Renders a Doc as an XML string.
 * @param doc - The Doc to render.
 * @returns The XML string representation of the Doc.
 */
export function docToString(doc: Doc): string {
  const version = doc.version || "1.0"
  const encoding = doc.encoding || "UTF-8"
  const xmlDeclaration = `<?xml version="${version}" encoding="${encoding}" standalone="no"?>`
  const docType = doc.internalDTD || doc.dtd
    ? `<!DOCTYPE ${doc.root.name} PUBLIC
  ${doc.internalDTD ? `"${doc.internalDTD}"` : ""}
  ${doc.dtd ? `"${doc.dtd}"` : ""}>`
    : ""
  const content = nodeToString(doc.root)

  const str = `${xmlDeclaration}${docType}${content}`
  return str
}

/**
 * Creates an XML element.
 *
 * @param name - The name of the element.
 * @param children - The (optional) contents of the element, either nodes or strings.
 * @param attributes - The attributes of the element, if any.
 * @returns An XML element.
 */
export function element(name: string, children?: ty.Some<Node>, attributes?: Attributes): Element {
  return {
    attributes,
    children,
    name,
  }
}

/**
 * Renders the Element as an XML string.
 *
 * @param element - The element to convert.
 * @returns The string representation of the element.
 */
export function elementToString(element: Element): string {
  let str = `<${element.name}`
  if (element.attributes && Object.keys(element.attributes).length > 0) {
    str = `${str} ${attributesToString(element.attributes)}`
  }
  if (element.children) {
    str = `${str}>`
    str = ty.reduceSome(element.children, (s, child) => {
      s = `${s}${nodeToString(child)}`
      return s
    }, str)
    str = `${str}</${element.name}>`
  }
  else {
    str = `${str} />`
  }
  return str
}

/**
 * Checks if the given object is a valid Element.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid Element; false otherwise.
 */
export function isAttributes(value: unknown): value is Attributes {
  return ty.isRecordOf<ty.Possible<string>>(value, ty.widen(ty.isString, ty.isNullish))
}

/**
 * Checks if the given object is a valid Element.
 *
 * @param obj - The object to check.
 * @returns True if the object is a valid Element; false otherwise.
 */
export const isElement = ty.typeGuardFor<Element>({
  attributes: ty.widen<Attributes, undefined>(isAttributes, ty.isUndefined),
  children: ty.widen<ty.Some<Node>, undefined>(ty.typeGuardSome<Node>(isNode), ty.isUndefined),
  name: ty.isString,
})

/**
 * Checks if the given object is a Node.
 * @param obj - The object to check.
 * @returns True if the object is an Element or a String; false otherwise.
 */
export function isNode(obj: unknown): obj is Node {
  if (ty.isString(obj)) {
    return true
  }
  if (isElement(obj)) {
    return true
  }
  return false
}

/**
 * Renders a Node as an XML string.
 *
 * @param node - The Node to render.
 * @returns The XML string representation of the Node.
 */
export function nodeToString(node: Node): string {
  if (ty.isString(node)) {
    return node
  }
  return elementToString(node)
}
