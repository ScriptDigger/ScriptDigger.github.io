# Advanced Property Randomizer

## What Is It?

**Advanced Property Randomizer** is an Adobe After Effects script that
applies randomized values to selected properties in the active
composition. It supports relative randomization, which adds a random
offset to the current value, and absolute randomization, which assigns a
random value from a specified range. For supported 2D and 3D properties,
you can choose which axes are affected, making it useful for quickly
creating varied positions, scales, rotations, color values, and other
numeric property settings without adjusting every value manually.

## Requirements

-   Adobe After Effects with support for ExtendScript (`.jsx`) scripts.
-   An open After Effects project containing at least one composition.
-   At least one layer selected in the active composition.
-   One or more supported properties selected in the Timeline panel.

## Installation

### Run the JSX file directly

1.  Save `Advanced_Property_Randomizer_ScriptDigger.jsx` to a folder you
    can easily access.
2.  Open Adobe After Effects and open your project.
3.  Choose **File → Scripts → Run Script File...**.
4.  Select the `.jsx` file and click **Open**.
5.  The **Property Randomizer** panel should appear.

### Install it in the After Effects Scripts folder

1.  Close After Effects.
2.  Copy the `.jsx` file into the appropriate After Effects `Scripts`
    folder. The exact path depends on your operating system and After
    Effects version.
3.  Restart After Effects.
4.  Open it from **File → Scripts**. If you want it to appear as a
    dockable panel, place it in the `Scripts/ScriptUI Panels` folder
    instead, if supported by your installation.

> **Note:** The script uses ScriptUI and ExtendScript. Availability and
> behavior can vary by After Effects version and operating system.

## Interface Overview

### 1. Mode

Choose how the script calculates the randomized value.

-   **Relative (+/-)** --- Adds a random offset from the Min/Max range
    to the property's current value.
-   **Absolute** --- Generates a random value within the Min/Max range
    and assigns it to the property.

Relative mode is selected by default.

**Example:** If a numeric property currently has a value of `100` and
the range is `-20` to `20`: - In **Relative** mode, the result will be
between `80` and `120`. - In **Absolute** mode, the result will be
between `-20` and `20`.

The Min and Max values define the random range. They can be negative or
positive. If Min is greater than Max, the script swaps the values
automatically.

### 2. Range

-   **Min** --- The lower limit of the random range.
-   **Max** --- The upper limit of the random range.

Enter valid numeric values in both fields. The script displays a warning
if either value is not numeric.

### 3. Apply to Parameters / Axis

Use the checkboxes to choose which components can be randomized:

-   **\[0\] X** --- First component.
-   **\[1\] Y** --- Second component.
-   **\[2\] Z** --- Third component.

The checkboxes are enabled by default.

How the axes apply depends on the selected property's value type:

  -----------------------------------------------------------------------
  Property type                       Components affected
  ----------------------------------- -----------------------------------
  One-dimensional numeric property    Uses the X checkbox as an
                                      enable/disable switch

  Two-dimensional property            X and Y checkboxes control the two
                                      components

  Three-dimensional property          X, Y, and Z checkboxes control the
                                      three components

  Color property                      X, Y, and Z checkboxes control the
                                      red, green, and blue channels;
                                      alpha is preserved
  -----------------------------------------------------------------------

For one-dimensional properties, the X checkbox does not mean that the
property is literally an X coordinate; it simply acts as the
first-component switch.

### 4. Randomize

Click **Randomize** to apply the selected settings to the selected
properties.

The script checks that: - An active composition is open. - At least one
layer is selected. - At least one property is selected in the Timeline
panel. - Min and Max contain valid numbers. - At least one axis checkbox
is enabled.

If the selection is invalid, the script displays a warning instead of
proceeding.

## Step-by-Step Workflow

1.  Open the composition you want to edit.
2.  Select one or more layers in the Timeline panel.
3.  Reveal the properties you want to randomize, such as **Position**,
    **Scale**, **Rotation**, **Opacity**, or a color property.
4.  Select the actual property rows in the Timeline panel. Selecting
    only the layer may not be enough; the script uses the selected
    properties.
5.  Open **Property Randomizer**.
6.  Choose **Relative (+/-)** or **Absolute**.
7.  Enter the desired **Min** and **Max** values.
8.  Enable the component checkboxes you want to affect.
9.  Move the Current Time Indicator to the desired time if you are
    working with an animated property.
10. Click **Randomize**.
11. Preview the result. If necessary, undo the operation and try a
    different range or axis selection.

## Working with Keyframed Properties

If a selected property already has keyframes, the script writes the
randomized value at the composition's current time. Depending on the
property's keyframe state and After Effects behavior, this can create a
new keyframe or update the keyframe at that time.

If a selected property has no keyframes, the script sets its property
value directly.

**Important:** The script does not randomize every existing keyframe
individually. For a keyframed property, it applies the result at the
current composition time.

## Color Properties

For supported color properties, the script randomizes the red, green,
and blue channels according to the selected component checkboxes. The
alpha channel, when present, is preserved.

Color channels are constrained to the `0.0–1.0` range. In Absolute mode,
values above `1` are interpreted by the script as percentage-style input
and divided by `100`; values below or equal to `1` are used directly.
For predictable results, use `0–100` for percentage-style RGB ranges or
`0–1` for normalized ranges, and test the result on a sample property
first.

## Practical Examples

### Randomize 2D Position

1.  Select the **Position** property of one or more layers.
2.  Choose **Relative (+/-)**.
3.  Set Min to `-50` and Max to `50`.
4.  Enable X and Y.
5.  Click **Randomize**.

This adds an independently generated offset to the X and Y components.

### Randomize Only the Horizontal Position

1.  Select the **Position** property.
2.  Choose a mode and set the range.
3.  Enable X and disable Y and Z.
4.  Click **Randomize**.

Only the first component is changed; the second component remains
unchanged.

### Assign Random Absolute Values

1.  Select a numeric property, such as **Rotation** or **Opacity**.
2.  Choose **Absolute**.
3.  Set a Min and Max range appropriate for that property.
4.  Make sure X is enabled.
5.  Click **Randomize**.

The selected property receives a random value from the specified range.
Consider the units and valid range of the property before applying
values.

### Randomize RGB Channels

1.  Select a supported color property.
2.  Choose a mode and set the range.
3.  Enable the channels you want to change using X, Y, and Z.
4.  Click **Randomize**.

The script maps the three checkboxes to red, green, and blue. Alpha is
not randomized.

## Tips and Best Practices

-   **Test on a duplicate layer or composition** before applying large
    random ranges to important work.
-   **Choose ranges appropriate to the property.** A range suitable for
    Position may be unsuitable for Opacity or Scale.
-   **Select property rows explicitly** in the Timeline panel.
-   **Use smaller ranges** for subtle variation and larger ranges for
    more noticeable changes.
-   **Check the current time** before randomizing keyframed properties.
-   **Use Undo** immediately if the result is not what you expected.
-   **Save your project** before performing large batches of changes.

## Troubleshooting

### "Please select an active composition first."

Activate a composition in the Timeline or Composition panel and try
again.

### "Please select at least one layer."

Select one or more layers in the active composition's Timeline panel.

### "Please select at least one property in the Timeline panel."

Expand the relevant layer and select the property rows you want to
randomize, not only the layer name.

### "Please enter valid numeric values for Min and Max."

Make sure both fields contain valid numbers, such as `-10`, `0`, `25`,
or `0.5`.

### "Select at least one parameter (X, Y, or Z)."

Enable at least one axis checkbox.

### No changes were applied

Confirm that the selected properties are supported numeric, 2D, 3D, or
color properties and that the correct component checkbox is enabled.

### The ScriptDigger logo does not open the website

The logo is intended to open
[ScriptDigger.github.io](https://ScriptDigger.github.io) in the system's
default browser. If clicking it does not work in your environment, open
the URL manually in a browser.

## ScriptDigger

The ScriptDigger logo at the bottom of the panel links to the
ScriptDigger website:

-   Website: https://ScriptDigger.github.io

## Notes and Limitations

-   The script processes the properties selected in the Timeline panel;
    it does not automatically scan every property on every selected
    layer.
-   The script is intended for supported numeric, 2D, 3D, and color
    values. Some specialized or custom property types may not behave
    like ordinary numeric properties.
-   Relative mode adds a random offset to the value at the current time.
    It does not guarantee that the resulting value stays within the
    Min/Max range; those values define the offset range.
-   Absolute mode assigns a value from the specified range, so confirm
    that the range makes sense for the property.
-   For animated properties, the operation affects the current
    composition time rather than independently processing all existing
    keyframes.
-   Always review the result in After Effects, especially when working
    with expressions, constrained values, or specialized effect
    controls.

------------------------------------------------------------------------

**Advanced Property Randomizer**\
*ScriptDigger --- After Effects scripting tools*
