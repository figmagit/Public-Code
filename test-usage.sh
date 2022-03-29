#!/usr/bin/env bash

set -xueo pipefail

rm -rf test-artifacts
mkdir -p test-artifacts
pushd test-artifacts

cat > package.json << EOF
{}
EOF

cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["es6"],
    "strict": true,
    "jsx": "react",
    "jsxFactory": "figma.widget.h",
    "jsxFragmentFactory": "figma.widget.Fragment",
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@figma"
    ]
  }
}
EOF

cat > code.tsx << EOF
/**
 * Test file to make sure that widget-typings work as expected.
 */
const { widget } = figma
const {
  AutoLayout,
  Text,
  Frame,
  Ellipse,
  Line,
  useSyncedState,
  useSyncedMap,
  useEffect,
  usePropertyMenu
} = widget

function Widget() {
  const [foo, setFoo] = useSyncedState("foo", () => 0)
  const [bar, setBar] = useSyncedState("bar", 0)
  const bazMap = useSyncedMap("baz")

  useEffect(() => {
    console.log(foo)
    console.log(bar)
    if (bazMap.has("hello")) {
      console.log(bazMap.get("hello"))
    }
  })

  usePropertyMenu(
    [
      {
        itemType: 'action',
        tooltip: 'Action',
        propertyName: 'action',
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'color-selector',
        propertyName: 'color-selector',
        tooltip: 'Color selector',
        selectedOption: '#000',
        options: [{option: '#000', tooltip: "Black"}],
      },
      {
        itemType: 'dropdown',
        propertyName: 'dropdown',
        tooltip: 'Dropdown',
        selectedOption: 'option1',
        options: [{option: 'option1', label: 'Option 1'}],
      },
    ],
    ({propertyName, propertyValue}) => {}
  )

  return (
    <AutoLayout>
      <Text
        onClick={() => {
          setFoo(foo + 1)
          setBar(bar => bar + 1)
        }}
      >
        {foo}
        {" "}
        {bar}
      </Text>
      <Frame width={100} height={200}>
        <Text
          x={{ type: 'left', offset: 5 }}
          y={{ type: 'bottom', offset: 5 }}
        >
          Offsets
        </Text>
        <>
          <Line />
          <Ellipse arcData={{ startingAngle: 1, endingAngle: 1, innerRadius: 1}} />
        </>
      </Frame>
    </AutoLayout>
  )
}

widget.register(Widget)
EOF


npm install typescript
npm install @figma/plugin-typings
npm install ../
npx tsc --noEmit

popd