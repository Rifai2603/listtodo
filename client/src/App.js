import { useEffect, useState } from 'react';
const api_base = 'http://localhost:3001';

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch(api_base + '/todos');
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    getTodos();
  }, []);

  const completeTodo = async (id) => {
    try {
      const response = await fetch(api_base + '/todo/complete/' + id);
      const data = await response.json();

      setTodos((todos) =>
        todos.map((todo) => {
          if (todo._id === data._id) {
            return { ...todo, complete: data.complete };
          }
          return todo;
        })
      );
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch(api_base + "/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: newTodo
        })
      });
      const data = await response.json();

      setTodos((todos) => [...todos, data]);
      setPopupActive(false);
      setNewTodo("");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" });

      setTodos((todos) => todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Halo, User</h1>
      <h4>Agenda Anda</h4>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={"todo" + (todo.complete ? " is-complete" : "")}
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>
              <div className="text">{todo.text}</div>
              <div
                className="delete-todo"
                onClick={() => deleteTodo(todo._id)}
              >
                x
              </div>
            </div>
          ))
        ) : (
          <p>Saat ini Anda tidak memiliki agenda apapun</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Tambah Agenda</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Buat Agenda
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
