module.exports = {
  addClass (el, className) {
    if (el.classList) {
      el.classList.add(className)
    } else {
      el.className = `${el.className} ${className}`
    }
  },
  appendElement (parent, el) {
    parent.appendChild(el)
  },
  getElementByClass (className) {
    return Array.from(document.getElementsByClassName(className))[0]
  },
  getElementsByClass (className) {
    return Array.from(document.getElementsByClassName(className))
  },
  getElementByID (id) {
    return document.getElementById(id)
  },
  getStyleProp (el, prop) {
    if (this.$window.getComputedStyle) {
      return this.$window.getComputedStyle(el, null).getPropertyValue(prop)
    } else if (el.currentStyle) {
      return el.currentStyle[prop]
    }
    return false
  },
  hasClass (el, className) {
    return el.classList.contains(className)
  },
  hasParentClass (el, className) {
    if (this.hasClass(el, className)) {
      return true
    }
    return el.parentNode && this.hasParentClass(el.parentNode, className)
  },
  removeElement (el) {
    el.parentNode.removeChild(el)
  },
  removeClass (el, className) {
    if (el.classList) {
      el.classList.remove(className)
    } else {
      el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ')
    }
  },
  toggleClass (el, className) {
    el.classList.toggle(className)
  }
}
