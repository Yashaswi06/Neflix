import SignUp from "./components/Register";
import Login from "./components/Login";
import SearchBar from "./components/movie/SearchBar";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import AddMovie from "./components/movie/Addmovie";
import Home from "./pages/home/Home";
import List from "./components/list/List";
import MovieInfoComponent from "./components/movie/movieInfo";
import DefaultList from "./components/movie/DefaultList";
import AdminDashboard from "./components/movie/admindashboar";
import FavoriteList from "./components/movie/Favlist";
import PrivateRoute from "./components/PrivateRoute";
import Watch from "./pages/watch/Watch";
import ProfilePage from "./components/profile/profile";
import UpdateMovie from "./components/movie/updatemovie";

function App() {
    const isAuthenticated = localStorage.getItem("token"); 
    console.log(isAuthenticated);
    const userRole = localStorage.getItem("role"); 

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/home"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["admin", "user"]}
                            userRole={userRole}
                        >
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/searchlist"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["user", "admin"]}
                            userRole={userRole}
                        >
                            <SearchBar />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/defaultlist"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["user", "admin"]}
                            userRole={userRole}
                        >
                            <DefaultList />
                        </PrivateRoute>
                    }
                />
                
                <Route
                    path="/addmovie"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["admin"]}
                            userRole={userRole}
                        >
                            <AddMovie />
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/updatemovie"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["admin"]}
                            userRole={userRole}
                        >
                            <UpdateMovie />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/list"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["user", "admin"]}
                            userRole={userRole}
                        >
                            <List />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/watch/:movieId"
                    element={ <Watch />
                        // <PrivateRoute
                        //     isAuthenticated={isAuthenticated}
                        //     allowedRoles={["user", "admin"]}
                        //     userRole={userRole}
                        // >
                        //     <Watch />
                        // </PrivateRoute>
                    }
                />
                <Route
                    path="/moviesinfo/:movieId"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["user", "admin"]}
                            userRole={userRole}
                        >
                            <MovieInfoComponent />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={ 
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["admin"]}
                            userRole={userRole}
                        >
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/favlist"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["user", "admin"]}
                            userRole={userRole}
                        >
                            <FavoriteList />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/profile/:userId"
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["user", "admin"]}
                            userRole={userRole}
                        >
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />

                {/* Default fallback route */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
