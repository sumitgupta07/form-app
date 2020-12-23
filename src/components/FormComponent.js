import React, {useEffect, useState} from 'react';
import fetchConfig from '../api';
import {DROPDOWN, TEXT} from '../utils/constants';
import {toCamelCase} from '../utils/helpers';

const FormComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const {questions} = await fetchConfig();
        let formValues = {};
        questions.forEach((question) => {
          question.fields.forEach((field) => {
            formValues[field.name] = '';
          });
        });
        setQuestions(questions);
        setFormValues(formValues);
      } catch (error) {
        console.error('Error while fetching configuration', error);
        setError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  //Handling input change event
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value});
  };

  //Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    //Converting response keys to camelcase
    let response = {};
    Object.keys(formValues).forEach((key) => {
      let field = toCamelCase(key);
      response[field] = formValues[key];
    });
    console.log(response);

    //Clearing form inputs
    let formInputs = {};
    Object.keys(formValues).forEach((item) => {
      formInputs[item] = '';
    });
    setFormValues(formInputs);
  };

  //If config is loading, display loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }
  //If error fetching configuration, Show error
  if (error) {
    return <div>Error loading form!!!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, idx) => (
        <div key={question.title}>
          <h2>
            Q{idx + 1}. {question.title}
          </h2>
          {question.fields.length > 0 &&
            question.fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === TEXT && <input name={field.name} id={field.name} type='text' value={formValues[field.name]} onChange={handleChange} />}
                {field.type === DROPDOWN && (
                  <select id={field.name} name={field.name} value={formValues[field.name]} onChange={handleChange}>
                    <option value=''>--select option--</option>
                    {field.options &&
                      field.options.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            ))}
        </div>
      ))}
      <button type='submit'>Submit</button>
    </form>
  );
};

export default FormComponent;
