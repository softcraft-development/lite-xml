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
  children?: Children
  name: string
}

/**
 * An XML Node, which may be either an Element or a string.
 */
export type Node = Element | string

/**
 * An array of Nodes.
 * Typically contained by an Element.
 */
export type Children = Node[]

/**
 * Appends an Element to a list of Children.
 *
 * @param children - The list of children to append to.
 * @param element - The element to append.
 * @returns The updated list of children.
 */
export function append(children: Children, element: Element): Children {
  return ty.append(children, element)
}

/**
 * Renders a collection of Attributes as a string.
 *
 * @param attributes - The attributes object to convert.
 * @returns The string representation of the attributes.
 */
export function attributesToString(attributes: Attributes): string {
  return ty.reduce(attributes, (array, value, key) => {
    if (ty.isDefinite(value)) {
      array.push(`${key}="${value.replace("\"", "&quot;")}"`)
    }
    else {
      array.push(key)
    }
    return array
  }, ty.arr<string>()).join(" ")
}

/**
 * Renders a Doc as an XML string.
 * @param doc - The Doc to render.
 * @returns The XML string representation of the Doc.
 */
export function docToString(doc: Doc): string {
  const str = `<?xml version="${doc.version || "1.0"}" encoding="${doc.encoding || "UTF-8"}" standalone="no"?>
<!DOCTYPE ${doc.root.name} PUBLIC
  ${doc.internalDTD ? `"${doc.internalDTD}"` : ""}
  ${doc.dtd ? `"${doc.dtd}"` : ""}>
${nodeToString(doc.root)}`
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
export function element(name: string, children?: Node | Children, attributes?: Attributes): Element {
  let wrapped: ty.Optional<Children>
  if (children) {
    wrapped = ty.wrap(children)
  }
  else {
    wrapped = undefined
  }
  return {
    attributes,
    children: wrapped,
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
    str = element.children.reduce<string>((s, child) => {
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
export function isElement(obj?: unknown): obj is Element {
  return (!!obj) && (typeof (obj as Element).name === "string")
}

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
