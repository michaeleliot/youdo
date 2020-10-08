import 'reset-css';
import '../styles/globals.css'
import { resetServerContext } from 'react-beautiful-dnd';
import { Provider } from 'react-redux';
import withRedux from "next-redux-wrapper";
import store from '../redux/store';

function App({ Component, pageProps }) {
  resetServerContext()
  return <Provider store={store}>
    <Component {...pageProps} />
  </Provider>

}

App.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  //Anything returned here can be access by the client
  return { pageProps: pageProps };
}

const makeStore = () => store;

export default withRedux(makeStore)(App)
