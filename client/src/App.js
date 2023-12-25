import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client';

const query = gql`
  query GetTodos{
    getTodos {
      title
      completed
      userId
      user{
        name
      }
    }
  }
`

function App() {
  const { data, loading } = useQuery(query)
  return (
    <div className="App">
      {loading ? <h1>Loading ...</h1> : <div>
        <table>
          <tbody>
            {data.getTodos.map(todo => <tr>
              <td>{todo.title}</td>
              <td>{todo.user.name}</td>
            </tr>)}
            
          </tbody>
        </table>
        {/* {JSON.stringify(data)} */}
      </div>}
    </div>
  );
}

export default App;
