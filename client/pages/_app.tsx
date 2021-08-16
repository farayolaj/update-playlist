import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from '../src/theme';
import { ApolloProvider } from '@apollo/client';
import client from '../src/apollo-client';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
