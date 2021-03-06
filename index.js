const aliases = require('./aliases.json')

const toAlias = Object.fromEntries(
  Object.entries(aliases).map(entry => entry.reverse())
)

const expandLineage = lineage => {
  const parts = lineage.split('.')
  const [root, ...rest] = parts
  return aliases[root] ? [aliases[root], ...rest].join('.') : lineage
}

const topologise = (lineages, fillGaps = false) => {
  const root = { name: '', children: [] }
  const nodes = { '': root }
  for (const name of lineages) {
    if (name in nodes) continue
    let node = { name, children: [] }
    nodes[name] = node
    const levels = name.split('.')
    while (levels.length > 0) {
      levels.splice(-1)
      const parent = levels.join('.')
      if (parent in nodes) {
        nodes[parent].children.push(node)
        break
      }
      if (fillGaps || lineages.includes(parent)) {
        node = { name: parent, children: [node] }
        nodes[parent] = node
      }
    }
  }
  return root.children
}

const buildFullTopology = (lineages) => topologise(lineages, true)

const lineageRegex = /^[A-Z]{1,2}(\.[0-9]+)*$/

const isPangoLineage = string => lineageRegex.test(string)

const whoVariants = {
  'B.1.1.7': 'Alpha',
  'B.1.351': 'Beta',
  'B.1.1.28.1': 'Gamma',
  'B.1.617.2': 'Delta',
  'B.1.429': 'Epsilon',
  'B.1.427': 'Epsilon',
  'B.1.1.28.2': 'Zeta',
  'B.1.525': 'Eta',
  'B.1.1.28.3': 'Theta',
  'B.1.526': 'Iota',
  'B.1.617.1': 'Kappa',
  'B.1.1.1.37': 'Lambda',
  'B.1.621': 'Mu',
  'B.1.1.529': 'Omicron'
}

module.exports = {
  aliases,
  buildFullTopology,
  expandLineage,
  isPangoLineage,
  toAlias,
  topologise,
  whoVariants
}
