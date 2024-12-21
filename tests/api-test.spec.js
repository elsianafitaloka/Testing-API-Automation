const { test, expect } = require("@playwright/test");
const Ajv = require("ajv");

const ajv = new Ajv(); //jsonschema

// GET Test Case
test('Test Case 1', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2');
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.data.id).toBe(2);
    expect(responseData.data.email).toBe("janet.weaver@reqres.in");
    expect(responseData.data.first_name).toBe("Janet");
    expect(responseData.data.last_name).toBe("Weaver");
    expect(responseData.data.avatar).toBe("https://reqres.in/img/faces/2-image.jpg");

    // Import and validate the schema
    const schema = require('./jsonschema/get-object-schema'); // Ensure the schema is exported as a JS module
    const valid = ajv.validate(schema, responseData);

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText(ajv.errors));
    }
    expect(valid).toBe(true);
});

// POST Test Case
test('Test Case 2', async ({ request }) => {
    const bodyData = {
        name: "morpheus",
        job: "leader"
    };

    const headerData = {
        Accept: 'application/json'
    };

    const response = await request.post('https://reqres.in/api/users', {
        headers: headerData,
        json: bodyData
    });

    const responseData = await response.json();
    console.log("POST Response Data:", responseData);

    // Validate response status
    expect(response.status()).toBe(201);

    // Validate returned fields (as per actual API behavior)
    expect(responseData).toHaveProperty("id");
    expect(responseData).toHaveProperty("createdAt");
});

//DELETE
test('Test Case 3', async ({ request }) => {
    const response = await request.delete('https://reqres.in/api/users/2');
    expect(response.status()).toBe(204); 
});


//PUT
test('Test Case 4', async ({ request }) => {
    const bodyData = {
        "name": "morpheus",
        "job": "zion resident"
    };

    const headerData = {
        Accept: 'application/json'
    };

    const response = await request.put('https://reqres.in/api/users/2', {
        headers: headerData,
        json: bodyData
    });

    const responseData = await response.json();
    console.log("PUT Response Data:", responseData);

    // Validate response status
    expect(response.status()).toBe(200);

    // Validate that updatedAt exists in the response
    expect(responseData).toHaveProperty("updatedAt");
});




