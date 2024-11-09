export const getOrderByNameQuery = `
query GetOrderByOrderNumber($orderQuery: String!) {
    orders(first: 1, query: $orderQuery) {
        nodes {
            id
            name
            fulfillable
            billingAddress {
                zip
                countryCodeV2
            }
            shippingAddress {
                zip
                countryCodeV2
            }
            customerLocale
            fulfillmentOrders(first: 1) {
                nodes {
                    id
                    status
                    lineItems(first: 230) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            id
                            sku
                            remainingQuantity
                        }
                    }
                }
            }
        }
    }
}

`;

export const getFluentIDQuery = `
query order($ref: String){
    order(ref: $ref) {
      id
      ref
    }
 }
`;

export const getMandatoryFields = `
query getOrder($orderId: ID!){
    orderById(id: $orderId) {
      id
      ref
      createdOn
      items(first:10000) {
          edges {
            node {
              ref
              quantity
              price
              totalPrice
              taxPrice
              totalTaxPrice
              attributes {
                name
                value
                type
              }
            }
          }
        }
      fulfilmentChoice {
        currency
        fulfilmentPrice
        fulfilmentTaxPrice
        deliveryAddress {
            companyName
            name
            street
            street2
            city
            state
            postcode
            country
        }
      }
      customer {
        id
        ref
        primaryEmail
        primaryPhone
        firstName
        lastName
      }
      attributes {
        name
        value
        type
      }
      billingAddress {
        companyName
        name
        street
        street2
        city
        state
        postcode
        country
      }
      financialTransactions {
          edges {
              node {
                  ref
                  total
                  paymentMethod
                  externalTransactionCode
                  type
                  currency
                  externalTransactionId
              }
          }
      }
      fulfilments {
        edges {
          node {
            id
            ref
            status
            fromLocation {
              ref
            }
            attributes {
              name
              value
              type
            }
          }
        }
      }
    }
  }
`;
