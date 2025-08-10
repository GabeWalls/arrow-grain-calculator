# Arrow Grain Calculator — User Guide

This guide explains how to **use** the Arrow Grain Calculator application.

---

## What the App Does
- Lets you enter arrow component weights (knock, fletching, shaft via GPI × length, insert, tip).
- Calculates **Total Arrow Weight (grains)** and **FOC %** in real time.
- Saves your build to a database so you can **load, edit, or delete** it later.

## Key Concepts
- **GPI (Grains Per Inch)**: Manufacturer spec for the shaft. The app multiplies **GPI × Arrow Length** to compute the shaft’s total grains.
- **FOC (Front of Center)**: Measures how forward-balanced an arrow is. The app shows it in green if it’s in a generally accepted range (10–20%), otherwise red.

## Step-by-Step
1. **Open the app** (frontend URL, typically http://localhost:5173).
2. In the form:
   - Enter **Knock**, **Fletching**, **Insert**, and **Tip** grain weights.
   - Enter **GPI** and choose **Arrow Length** from the dropdown. The **Shaft (Total Grains)** field updates automatically.
3. Click **Calculate** (optional—the UI also updates live).
4. View **Total Arrow Weight** and **FOC %** under the form.
5. To save the configuration:
   - Enter a **Build Name**.
   - Click **Save Build** (or **Update Build** if you loaded one).
6. Scroll down to **Saved Builds**:
   - **Load**: Populate the form with a saved build’s values.
   - **Delete**: Remove a build permanently.

## Tips
- Clicking on parts in the **arrow SVG** scrolls to the corresponding input.
- FOC turns **green** when within ~10–20% (commonly preferred), **red** otherwise.
- You can start fresh with **New Build** at any time.

---

## Example Workflow
1. Set **GPI** to `8.4`, **Arrow Length** to `29.00"` → shaft grains auto-calc: `243.6`.
2. Enter **Knock** `9`, **Fletching** `21`, **Insert** `50`, **Tip** `125`.
3. See results (e.g., **Total** ≈ `448.6` grains, **FOC** in the shown color).
4. Name it **“Whitetail 2025”** and **Save Build**.
5. Confirm it appears under **Saved Builds** with a timestamp. You can now **Load** or **Delete** it.
