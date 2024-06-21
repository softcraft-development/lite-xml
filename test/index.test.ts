import { DOMParser } from "@xmldom/xmldom"
import { isPlural } from "typonomy"
import { beforeEach, describe, expect, it } from "vitest"
import * as lib from "../src/index.js"

describe("docToString", () => {
  let document: () => lib.Doc
  let result: () => string
  let parsed: () => Document

  beforeEach(() => {
    document = () => ({
      root: {
        name: "root",
      },
    })
    result = () => lib.docToString(document())
    parsed = () => new DOMParser().parseFromString(result())
  })

  describe("with a DTD", () => {
    beforeEach(() => {
      document = () => ({
        dtd: "external",
        root: {
          name: "root",
        },
      })
    })

    it("renders the DTD", () => {
      expect(parsed().doctype?.publicId).toContain("external")
    })
  })

  describe("with an encoding", () => {
    beforeEach(() => {
      document = () => ({
        encoding: "UTF-16",
        root: {
          name: "root",
        },
      })
    })

    it("sets the encoding on the XML declaration", () => {
      expect(result()).toMatch(/<\?xml .*encoding=\"UTF-16\".*?>/)
    })
  })

  describe("with a an internal DTD", () => {
    beforeEach(() => {
      document = () => ({
        internalDTD: "internal",
        root: {
          name: "root",
        },
      })
    })

    it("sets the internal DTD", () => {
      expect(parsed().doctype?.publicId).toContain("internal")
    })
  })

  describe("with a version", () => {
    beforeEach(() => {
      document = () => ({
        root: {
          name: "root",
        },
        version: "1.1",
      })
    })

    it("sets the encoding on the XML declaration", () => {
      expect(result()).toMatch(/<\?xml .*version=\"1.1\".*?>/)
    })
  })

  it("renders a valid XML document", () => {
    expect(parsed()).toBeTruthy()
  })

  it("has no doctype", () => {
    expect(result()).not.toContain("<!DOCTYPE")
  })

  it("has the root element", () => {
    expect(parsed().documentElement.nodeName).toEqual("root")
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
      expect(lib.element("test", "text").children).toEqual("text")
    })
  })

  describe("when passed a single element child", () => {
    it("contains that child", () => {
      const result = lib.element("test", lib.element("child"))
      if (isPlural(result.children)) {
        expect.fail("Expected a single child")
      }
      if (!lib.isElement(result.children)) {
        expect.fail("Expected child to be an element")
      }
      expect(result.children.name).toEqual("child")
    })
  })

  describe("when passed multiple strings", () => {
    it("contains those strings", () => {
      expect(lib.element("test", ["a", "b"]).children).toEqual(["a", "b"])
    })
  })
})

describe("isAttributes", () => {
  it("returns true for a string map", () => {
    expect(lib.isAttributes({ isExplicit: "value", isNull: null, isUndefined: undefined })).toBe(true)
  })

  it("returns false for null", () => {
    expect(lib.isAttributes(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(lib.isAttributes(undefined)).toBe(false)
  })

  it("returns true an empty object", () => {
    expect(lib.isAttributes({})).toBe(true)
  })

  it("returns false for a string", () => {
    expect(lib.isAttributes("attribute")).toBe(false)
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
