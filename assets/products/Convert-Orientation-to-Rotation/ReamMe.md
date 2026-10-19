# Convert Orientation to Rotation

![Ae Script Free Download](https://ScriptDigger.github.io/assets/products/Convert-Orientation-to-Rotation/Convert-Orientation-to-Rotation.png)

## Overview
This After Effects script converts a 3D layer's Orientation into X, Y, and Z Rotation values while attempting to preserve its original 3D direction.

## How to Use
1. Open your composition.
2. Select one or more 3D layers.
3. Run the script.
4. The script sets Orientation to `0, 0, 0` and adjusts the X, Y, and Z Rotation values to match the original direction as closely as possible.
5. Review the results.

## Notes
- Only 3D layers are processed.
- 2D layers are skipped.
- The conversion uses the current time.
- The script uses numerical optimization to find suitable rotation values.
- Results may not be perfectly identical in every case.

## Undo
The conversion is grouped into a single Undo operation.

## Error Handling
The script reports the number of converted, skipped, and failed layers. Any layer-specific errors are displayed in the results.