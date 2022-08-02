import { useState } from 'react';
import { Formik } from 'formik';

const brands = [
  'Maiden Home',
  'Stickley',
  'Floyd',
  'Vermont Woods Studio',
  'Simplicity Sofas',
  'Eastvold Furniture',
  'Vaughan-Bassett',
  'The Joinery',
];

function App() {
  const [sales, setSales] = useState(
    brands.reduce((obj1, brand1) => ({
      ...obj1,
      [brand1]: brands
        .filter((brand2) => brand1 !== brand2)
        .reduce((obj, brand2) => ({
          ...obj,
          [brand2]: 0
        }), {})
    }), {})
  );

  const getPurchasedWith = (brand1) => {
    return brands
      .filter((brand2) => brand1 !== brand2)
      .map((brand2) => ({
        label: brand2,
        value: sales[brand1][brand2]
      }))
      .sort((b1, b2) => b2.value - b1.value)
      .map(({ label, value }, i) => (
        <li key={i}>
          {label}({value})
        </li>
      ))
      .slice(0, 3);
  }

  const handlePurchase = (value) => {
    const selectedBrands = Object.keys(value).filter((key) => value[key]);
    const out = JSON.parse(JSON.stringify(sales));

    for (let brand1 of selectedBrands) {
      for (let brand2 of selectedBrands) {
        if (brand1 !== brand2) {
          out[brand1][brand2]++;
        }
      }
    }

    setSales(out);
  }

  return (
    <Formik
      initialValues={brands.reduce((obj, brand) => ({
        ...obj,
        [brand]: false
      }), {})}
      validate={(values) => {
        return Object.keys(values).filter((key) => values[key]).length ?
          {} :
          { error: 'Invalid length' };
      }}
      onSubmit={handlePurchase}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <div className="App">
          {brands.map((brand, i) => (
            <div key={i}>
              <input
                type='checkbox'
                name={brand}
                value={values[brand]}
                onChange={handleChange}
              />
              <label>{brand}</label>
              <p>Often sold with:</p>
              <ul>
                {getPurchasedWith(brand)}
              </ul>
            </div>
          ))}
          <button
            disabled={errors.error}
            type='submit'
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </Formik>
  );
}

export default App;
