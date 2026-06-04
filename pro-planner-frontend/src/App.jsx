import { useState, useEffect } from 'react';
import axios from 'axios';
import StudyNavbar from './StudyNavbar';
import StudyLoginPage from './StudyLoginPage';
import TaskCard from './TaskCard';

function App() {
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [deadline, setDeadline] = useState("");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [quote, setQuote] = useState("Loading motivation...");

  // Fetch Tasks AND a Daily Quote when logged in
  useEffect(() => {
    if (isLoggedIn) {
      getTasks();
      fetchQuote();
    }
  }, [isLoggedIn]);

  const getTasks = async () => {
    const response = await axios.get("http://localhost:3000/tasks");
    setTasks(response.data);
  };

  const fetchQuote = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/quotes/random");
      setQuote(response.data.quote);
    } catch (error) {
      setQuote("You can do this! Keep pushing forward.");
    }
  };

  const addTask = async () => {
    const newTask = { subject, taskDetails, deadline };
    await axios.post("http://localhost:3000/tasks", newTask);
    getTasks(); 
    setSubject(""); setTaskDetails(""); setDeadline("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`);
    getTasks(); 
  };

  return (
    isLoggedIn ? (
      // Main App Wrapper (Changes background based on Dark Mode)
      <div className={`min-vh-100 pb-5 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
        
        <StudyNavbar 
          setIsLoggedIn={setIsLoggedIn} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
        />
        
        <div className="container">
          
          {/* API Quote Section */}
          <div className="text-center mb-5 mt-4">
            <h5 className="fst-italic">"{quote}"</h5>
          </div>

          {/* Input Form Area */}
          <div className={`p-4 rounded shadow-sm mb-5 text-center border ${isDarkMode ? "bg-secondary border-secondary" : "bg-white"}`}>
            <h4 className={`mb-3 ${isDarkMode ? "text-light" : "text-primary"}`}>Add a New Study Task</h4>
            <input type="text" placeholder="Subject (e.g., Math)" className="form-control mb-3" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <input type="text" placeholder="What to study?" className="form-control mb-3" value={taskDetails} onChange={(e) => setTaskDetails(e.target.value)} />
            <input type="text" placeholder="Deadline (e.g., Friday)" className="form-control mb-3" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <button className="btn btn-primary w-50" onClick={addTask}>Add Task</button>
          </div>

          {/* Cards Display Area */}
          <div className="d-flex flex-wrap gap-4 justify-content-center">
            {tasks.map((item) => (
              <TaskCard 
                key={item._id} 
                subject={item.subject} 
                deadline={item.deadline} 
                taskDetails={item.taskDetails} 
                deleteTask={() => deleteTask(item._id)} 
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    ) : (
      <StudyLoginPage setIsLoggedIn={setIsLoggedIn} />
    )
  );
}

export default App;