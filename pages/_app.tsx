import 'reset-css';
import '../styles/globals.css'
import { resetServerContext } from 'react-beautiful-dnd';
import { Provider } from 'react-redux';
import { Provider as AuthProvider } from "next-auth/client";
import withRedux from "next-redux-wrapper";
import { useStore } from '../redux/store';

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  resetServerContext()
  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  )
}