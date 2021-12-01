import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../context/auth'
import NavigationBar from './NavigationBar'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    if (auth.loggedIn)
        return (
            <div>
                <NavigationBar />
                <HomeScreen />
            </div>
        )
    else
        return <SplashScreen />
}