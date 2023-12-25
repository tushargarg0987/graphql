const express = require('express')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }
            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                userId: ID!
                user: User
            }
            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async(todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
            },
            Query: {
                getTodos: async () => {
                    const resp = await axios.get('https://jsonplaceholder.typicode.com/todos');
                    return resp.data
                },
                getAllUsers: async () => {
                    const resp = await axios.get('https://jsonplaceholder.typicode.com/users');
                    return resp.data
                },
                getUser: async (parent, {id}) => {
                    const resp = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
                    return resp.data
                },
            },
        }
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(5000, () => {
        console.log("listening on port 5000")   
    })
}

startServer();