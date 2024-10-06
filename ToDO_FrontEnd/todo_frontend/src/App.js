import './App.css';
import {AiOutlineEdit, AiOutlineDelete} from "react-icons/ai";
import {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const Todos = ({todos}) => {
    return(
      <div className = "todos">
        {todos.map(todo => {
              return(
                <div className="todo" key={todo.id}>
                  <button onClick={() => changeStatusTodo(todo)} className = "checkbox" style={{backgroundColor: todo.status ? "#A879E6" : "white"}}></button>
                  <p>{todo.name}</p>
                  <button onClick={() => handleEditButton(todo)}>
                    <AiOutlineEdit size={20} color={"#64697b"}></AiOutlineEdit>
                  </button>
                  <button onClick={() => deleteTodo(todo)}>
                    <AiOutlineDelete size={20} color={"#64697b"}></AiOutlineDelete>
                  </button>
                </div>
              )
            })}
      </div>
    )
  }

  async function handleNewButton() {
    setInputVisibility(!inputVisibility);
  } 

  async function handleEditButton(todo) {
    setSelectedTodo(todo);
    setInputVisibility(true);
  }

  async function createTodo() {
    if (!inputValue) return;
    const response = await axios.post("http://localhost:3333/todos", {name: inputValue});
    getTodos();
    setInputVisibility(!inputVisibility);
    setInputValue("");
  }

  async function getTodos() {
    const response = await axios.get("http://localhost:3333/todos");
    setTodos(response.data);
  }

  async function editTodo() {
    const response = await axios.put("http://localhost:3333/todos", {id: selectedTodo.id, name: inputValue});
    setSelectedTodo();
    setInputVisibility(false);
    getTodos();
    setInputValue("");
  }

  async function deleteTodo(todo){
    await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    setInputValue("");
    setSelectedTodo();
    getTodos();
  }

  async function changeStatusTodo(todo) {
    const response = await axios.put("http://localhost:3333/todos", {id: todo.id, status: !todo.status});
    getTodos();
  }

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();
  
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <header className="container">
        <div className='header'>
          <h1>Don't be lazzy</h1>
        </div>
        <Todos todos={todos}></Todos>   
        <input value={inputValue} style={{display: inputVisibility ? "block" : "none"}} onChange={(event) => {setInputValue(event.target.value)}} className='inputName'></input>
        <button onClick={inputVisibility ? selectedTodo ? editTodo : createTodo : handleNewButton} className='newTaskButton'>
          {inputVisibility ? "Confirm" : "Add New Task"}
        </button>      
      </header>
    </div>
  );
}

export default App;
