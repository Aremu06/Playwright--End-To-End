# User Guide for QA Developers

## Creating and Using a New Product in Akeneo

### Introduction

This guide provides detailed instructions on defining a product in
the `src/domain/product-information/config/products.yaml` for end-to-end (E2E) testing within an Akeneo environment.

#### Prerequisites

- Familiarity with Akeneo PIM (Product Information Management).
- Basic understanding of YAML file format.
- Knowledge of JavaScript/TypeScript and the Playwright testing framework.

---

#### Step 1: Understanding the Code Structure

- The `GivenAProductInThePim` class in the codebase is responsible for the setup of a product in the PIM (Product
  Information Management) system. It utilizes other classes like `ProductFactory` and `RemoveExistingProductsByEan` for
  creating and managing (deleting) products.
- `ProductFactory` class generates a `ProductDto` (Data Transfer Object) from product configurations.
- `YamlProductConfigurationsLoader` loads product configurations from the `products.yaml` file.

---

#### Step 2: Defining a Product in `src/domain/product-information/config/products.yaml`

1. **Structure Understanding**: The `products.yaml` file contains product definitions. Each product is defined with
   attributes like `ean`, `sku`, `title`, `dimensions`, etc.

2. **Adding a New Product**:
    - Open `src/domain/product-information/config/products.yaml`.
    - Define a new product by adding a key under `products`. Follow the existing format as shown in the file.
    - Provide values for required fields such as `baseProductId`, `ean`, `sku`, `title`, `description`, etc.
    - For dimensions, provide values for `length`, `width`, `height`, `nettoWeight`, and `bruttoWeight`.
    - Add any relevant tags in the `tags` array.

   Example:
   ```yaml
   products:
     yourNewProduct:
       baseProductId: "existing-real-product-id"
       parentVendorCode: "parent-model-identifier"
       ean: "YOUR EAN"
       sku: "YOUR SKU"
       title: "Your Product Title"
       description: "Your Product Description"
       contentSize: "80g"
       dimensions:
         length: "15"
         width: "10"
         height: "5"
         nettoWeight: "200"
         bruttoWeight: "250"
       tags:
         - "tag1"
         - "tag2"
   ```

3. **Inheritance**:
    - Products can inherit properties from other products using `inheritsFrom`.
    - Modify only the necessary attributes for the child product.

   Example:
   ```yaml
   products:
     yourDerivedProduct:
       inheritsFrom: yourNewProduct
       title: "Derived Product Title"
   ```

---

#### Special Fields in Product Definition

##### `baseProductId`

- **Purpose**: The `baseProductId` is crucial for loading an already existing product from the PIM (Product Information
  Management system). When a new product is defined in the `src/domain/product-information/config/products.yaml`, this ID is used to fetch a real product
  from the PIM database.
- **Functionality**: Instead of creating an entirely new product, `baseProductId` allows for modifying or overriding
  certain properties of the existing product. This feature is particularly useful for testing variations or updates to a
  product without the need to create a completely new entry in the PIM.
- **Usage Example**: In `products.yaml`, under your product definition:
  ```yaml
  products:
    yourProduct:
      baseProductId: "existing-real-product-id"
      ... # Other properties
  ```

##### `parentVendorCode`

- **Purpose**: This field is used to define hierarchical relationships within products, such as product variants.
- **Functionality**: The `parentVendorCode` links a product to its parent model in the PIM hierarchy. This is essential
  for creating and managing product variants that share common characteristics with their parent models.
- **Usage Example**: In `products.yaml`, for a product variant:
  ```yaml
  products:
    yourVariantProduct:
      parentVendorCode: "parent-model-identifier"
      ... # Other properties
  ```
- **Current Scope**: Currently, the e2e testing repository relies on existing models defined in the PIM. There is no
  functionality yet for defining new models within the e2e repository.

##### `contentSize`

- **Description**: The `contentSize` field in a product definition is used to specify the size of the product content,
  such as "80g".
- **Limitation**: Currently, this field only accepts values from a pre-defined list in Akeneo. Any value not existing in
  this list will be considered invalid. For example, while "80g" might be a valid entry, "666g" would not be accepted
  unless it's predefined in Akeneo.
- **Current State**: There is no mechanism within the e2e repository to add or modify the list of valid `contentSize`
  values. All size values must be pre-configured in the Akeneo PIM.

##### `tags`

- **Description**: The `tags` field allows assigning one or more categorization tags to a product, such as "Vegan" or "
  Seasonal".
- **Limitation**: Similar to `contentSize`, `tags` can only include values that are already defined in Akeneo. The e2e
  testing setup does not support adding new tags or modifying existing ones. Therefore, a tag like "TestTag1" would be
  invalid unless it is part of the predefined tag list in Akeneo.
- **Current State**: The e2e testing repository relies on the tag list as defined in the Akeneo PIM. There is no
  functionality to manage or expand this list from the e2e testing setup.

---

### Adding a New Product Property

Introducing a new product property in the Akeneo e2e testing setup involves several steps. While the process is
currently a bit cumbersome, it is crucial for ensuring that the product data is comprehensive and accurately tested.
This guide outlines the necessary steps to add a new property.

1. **Extend `ProductDto`**: Add the new property to the `ProductDto` class. Define the data type and any necessary logic
   related to this property.

2. **Update `CreateProduct` Class**: Modify the `CreateProduct` class to map the new property from `ProductDto` to the
   Akeneo API format. Ensure the mapping aligns with Akeneo's data expectations.

3. **Configure `products.yaml`**: In `src/domain/product-information/config/products.yaml`, add the new property to the product definitions. Ensure the
   values are consistent with the new property's data type and purpose.

4. **Adjust `ProductFactory`**: Update the `ProductFactory` class to extract the new property from the YAML
   configuration and incorporate it into the `ProductDto` instances.

Example: If you're adding a property named `newProperty`, include it in `ProductDto`, map it in `CreateProduct`, define
it for each product in `products.yaml`, and ensure `ProductFactory` sets it appropriately in the `ProductDto`.

---

### Adding a Custom Assertion

1. **Create Custom Assertion Class**: Define a new class that implements the `Probe` interface for the specific property you want to assert. Example: `ValidateNewProperty`.

2. **Implement `verify` Method**: In this class, implement the `verify` method to check the actual value of the property against the expected value. Use the `expect` function from Playwright/Test for the assertion.

3. **Integrate into Validation Process**:
    - Update the `ValidateImportAgainstExpectedVariantData` or `ValidateImportAgainstExpectedProductData` class.
    - Add a call to the `verify` method of your new custom assertion class within these classes’ `verify` method.

Example: If your new property is `newProperty`, create `ValidateNewProperty` class with a `verify` method that compares the expected and actual values of `newProperty`. Then, call this new `verify` method within the existing validation process.

---

#### Known Limitations and Status of the POC

##### Limitations

- **Model Definition**: As of now, the e2e testing setup does not support the creation of new parent models within the
  repository. It relies entirely on pre-existing models and hierarchies in the PIM.
- **Field Overrides**: The mechanism to override fields of an existing product using `baseProductId` is limited to the
  properties defined in the YAML configuration. It does not support complex alterations or relationships not yet modeled
  in the PIM structure.

##### Status of the POC

- **Current Phase**: The Proof of Concept (POC) is primarily focused on demonstrating the feasibility of loading and
  modifying existing products from the PIM for testing purposes.
- **Future Developments**: There are plans to expand the capabilities of the e2e repository, including the potential for
  defining new models. However, these features are not part of the current POC and will be considered for future
  iterations.
- **Attribute Value Lists**: There may be future developments to allow the e2e testing repository to manage
  attribute list, e.g. for `Tags` or `contentSize` directly, enhancing flexibility and reducing dependency on
  pre-configured values in Akeneo.
