import { DOMParser } from "@xmldom/xmldom"
import { beforeAll, describe, expect, it } from "vitest"
import * as lib from "../src/index"

describe("append", () => {
  it("appends an element to the list of children", () => {
    const children = [{ name: "child1" }, { name: "child2" }]
    const element = { name: "child3" }
    const result = lib.append(children, element)
    expect(result).toEqual([{ name: "child1" }, { name: "child2" }, { name: "child3" }])
  })
})

describe("docToString", () => {
  let document: lib.Doc
  let result: string
  let parsed: Document

  beforeAll(() => {
    document = {
      encoding: "UTF-8",
      root: {
        name: "root",
      },
      version: "1.0",
    }
    result = lib.docToString(document)
    parsed = new DOMParser().parseFromString(result)
  })

  it("renders a valid XML document", () => {
    expect(parsed).toBeTruthy()
  })

  it("has the root element", () => {
    expect(parsed.documentElement.nodeName).toEqual("root")
  })
})

describe("element", () => {
  it("sets the element name", () => {
    expect(lib.element("test").name).toEqual("test")
  })

  it("sets the attributes", () => {
    expect(lib.element("test", undefined, { attr: "value" }).attributes).toEqual({ attr: "value" })
  })

  describe("when passed no children", () => {
    it("contains no children", () => {
      expect(lib.element("test").children).toBeUndefined()
    })
  })

  describe("when passed a single string child", () => {
    it("contains that string", () => {
      expect(lib.element("test", "child").children).toEqual(["child"])
    })
  })

  describe("when passed a single element child", () => {
    it("contains that child", () => {
      const result = lib.element("test", lib.element("child"))
      const first = result.children?.[0]
      expect(lib.isElement(first)).toBe(true)
      expect((first as lib.Element)?.name).toEqual("child")
    })
  })

  describe("when passed multiple strings", () => {
    it("contains those strings", () => {
      expect(lib.element("test", ["a", "b"]).children).toEqual(["a", "b"])
    })
  })
})

describe("isElement", () => {
  it("is true if the object an element", () => {
    const obj = lib.element("test ")
    const result = lib.isElement(obj)
    expect(result).toBe(true)
  })

  it("is false if the object is not an element", () => {
    const result = lib.isElement(undefined)
    expect(result).toBe(false)
  })
})

describe("isNode", () => {
  it("is true if the object an element", () => {
    const obj = lib.element("test")
    const result = lib.isNode(obj)
    expect(result).toBe(true)
  })

  it("is true if the object a string", () => {
    const result = lib.isNode("test")
    expect(result).toBe(true)
  })

  it("should return false if the object is neither an Element nor a String", () => {
    const obj = 123
    const result = lib.isNode(obj)
    expect(result).toBe(false)
  })
})

describe("nodeToString", () => {
  it("renders an element", () => {
    const result = lib.nodeToString(lib.element("test", "child", { attr: "value" }))
    expect(result).toEqual("<test attr=\"value\">child</test>")
  })

  it("render a string", () => {
    const node = "string1"
    const result = lib.nodeToString(node)
    expect(result).toEqual("string1")
  })
})

describe("attributesToString", () => {
  describe("when passed an attribute with a value", () => {
    it("renders the attribute as a key=value pair", () => {
      const attributes = { attr1: "value1" }
      const result = lib.attributesToString(attributes)
      const expected = "attr1=\"value1\""
      expect(result).toEqual(expected)
    })
  })

  describe("when passed an attribute with no value", () => {
    it("renders the attribute as the key", () => {
      const attributes = { attr1: undefined }
      const result = lib.attributesToString(attributes)
      const expected = "attr1"
      expect(result).toEqual(expected)
    })
  })
})

describe("elementToString", () => {
  it("renders an element", () => {
    const result = lib.elementToString(lib.element("test", "child", { attr: "value" }))
    expect(result).toEqual("<test attr=\"value\">child</test>")
  })

  it("renders an empty element", () => {
    const result = lib.elementToString(lib.element("test"))
    expect(result).toEqual("<test />")
  })
})
