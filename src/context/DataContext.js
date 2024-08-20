import { createContext, useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';
import useWindowSize from '../hooks/useWindowSize';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import api from "../api/posts";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {

    const [posts, setPosts] = useState( [] )
      const [ search, setSearch ] =  useState('');
      const [ searchResults, setSearchResults ] = useState([]);
      const [ postTitle, setPostTitle ] = useState('');
      const [ postBody, setPostBody ] = useState('');
      const { width } = useWindowSize()
      // using custom hook useWindowSize to vary the icons for various window sizes   
    
      // custom hook: useAxionFetch
      const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');
      useEffect( ()=> {
        setPosts(data);
      }, [data] )
        
      useEffect( () =>{
        const filteredResults = posts.filter( (post) => (
          ( (post.title).toLowerCase().includes(search.toLowerCase()) ) ||
          ( (post.body).toLowerCase().includes(search.toLowerCase()) )
         ) )
    
        setSearchResults(filteredResults.reverse())
      }, [posts, search] )
    
    
      const navigate = useNavigate();
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        
        // to convert string
        const reqID = Number(posts[posts.length - 1].id) + 1
        console.log(reqID+" "+typeof reqID);

        
        const id = posts.length ? reqID : 1; 
        
        
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };    
        try{
          await api.post('/posts', newPost); // to add new post to the server
      
          const allPosts = [...posts, newPost];
          setPosts(allPosts);
          setPostTitle('');
          setPostBody('');
          navigate('/'); // after insertion go back to home
        } catch (error) {
          if(error.response){
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else{
            console.log(`Error: ${error.message}`);
          }
        }
      }
      
      const handleDelete = async(id) => {
        try{
          await api.delete(`posts/${id}`);
          const postList = posts.filter( (post) => post.id !== id);
          setPosts(postList);
          console.log("deleted");   
          navigate('/');
        } catch(error) {
          console.log(error);
        }
      }
    
      // Edit post
      const [editTitle, setEditTitle] = useState('');
      const [editBody, setEditBody] = useState('');
    
      const handleEdit = async(id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody };
        try{
          const response = await api.put(`/posts/${id}`, updatedPost);
          setPosts(posts.map(post => post.id === id ? {...response.data} : post))
          setEditTitle('')
          setEditBody('')
          navigate('/');
        } catch (error) {
          if(error.response){
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else{
            console.log(`Error: ${error.message}`);
          }
        }
        setPosts(...posts, updatedPost);
        console.log(updatedPost);
        
        setEditTitle('');
        setEditBody('');
      }
    

    return (
        <DataContext.Provider value={{
            width, search, setSearch,
            searchResults, fetchError, isLoading,
            posts, setPosts, 
            handleSubmit, postTitle, setPostTitle, postBody, setPostBody,
            handleDelete,
            handleEdit, editTitle,setEditTitle,editBody,setEditBody
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;