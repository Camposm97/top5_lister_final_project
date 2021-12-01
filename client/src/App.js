import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './context/auth';
import { GlobalStoreContextProvider } from './context/store'
import {
    AppBanner,
    HomeWrapper,
    RegisterScreen,
} from './components'
import SignIn from './components/SignIn';
import { QueryContextProvider } from './context/query';

const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <QueryContextProvider>
                    <GlobalStoreContextProvider>
                        <AppBanner />
                        <Switch>
                            <Route path="/" exact component={HomeWrapper} />
                            <Route path="/login/" exact component={SignIn} />
                            <Route path="/register/" exact component={RegisterScreen} />
                        </Switch>
                    </GlobalStoreContextProvider>
                </QueryContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App