import { RiLoader2Line } from "react-icons/ri";
import { useContext } from "react"
import Feed from "./Feed"
import DataContext from "./context/DataContext"


const Home = (  ) => {

  const { searchResults, isLoading, fetchError } = useContext(DataContext)

  return (
    <main className="Home">
        {isLoading && <p className="statusMsg">
          <RiLoader2Line className="loader"/> 
          <br />
            Loading posts...</p>
        } 
        {!isLoading && fetchError && <p className="statusMsg" style={{ color: "red" }}>{fetchError}</p>} 
        {!isLoading && !fetchError && 
            ( searchResults.length ? 
                <Feed posts={searchResults} /> : 
                <p className="statusMsg">No posts to display.</p>
            )
        }
    </main>
  )
}

export default Home