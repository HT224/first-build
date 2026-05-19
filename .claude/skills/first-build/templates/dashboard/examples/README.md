# Data-shape examples

Three pre-baked shapes the classifier picks from. To switch shapes, copy
both files from the chosen example folder into the repo root:

```bash
cp examples/<shape>/data.json data.json
cp examples/<shape>/chart-config.json chart-config.json
```

Then edit `data.json` to replace the placeholder values with your real
numbers, and edit `chart-config.json` to set the title and axis labels.

| Shape | When to pick it | Default chart |
|---|---|---|
| `time-series` | Same metric measured over time (weeks, months, days). | Line |
| `categorical-bar` | One metric compared across categories (channels, teams, products). | Bar |
| `two-column-table` | Two columns where one is a label and the other a value, and a chart would not add anything. | Table only |

The `two-column-table` shape skips the chart entirely and renders only the
data table. The other two shapes render a chart and the underlying numbers
below it (toggle with `chart-config.json` → `showTable: false`).
