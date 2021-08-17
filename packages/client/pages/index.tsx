import { useMutation, useSubscription } from '@apollo/client';
import { Spacer } from '@chakra-ui/react';
import gql from 'graphql-tag';
import Head from 'next/head';
import { useEffect } from 'react';
import FileList from '../src/components/FileList';
import Header from '../src/components/Header';
import NavBar from '../src/components/NavBar';

type Dirent = {
  name: string;
  size?: number;
  __typename: 'Directory' | 'File';
};

const CD = gql`
  mutation cd($dir: String!) {
    cd(dir: $dir) {
      cwd
      children {
        name
        __typename
        ... on File {
          size
        }
      }
    }
  }
`;

const CDALT = gql`
  subscription cd {
    newCwd {
      cwd
      children {
        name
        __typename
        ... on File {
          size
        }
      }
    }
  }
`;

const parentDir: Dirent = {
  name: '..',
  __typename: 'Directory',
};

export default function Home() {
  const [cd] = useMutation(CD);
  const { loading, data, error } = useSubscription(CDALT);

  console.log(loading, data, error);

  useEffect(() => {
    const id = setTimeout(() => cd({ variables: { dir: '' } }), 5000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      <Head>
        <title>Update Playlist</title>
        <meta name="description" content="Update your song metadata automatically" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <NavBar
          path={data?.newCwd?.cwd}
          changeDirectory={(path) => {
            console.log(path);
            cd({ variables: { dir: path } });
          }}
        />
        <Spacer h=".5rem" />
        <FileList
          loading={loading}
          data={
            data
              ? [parentDir, ...data.newCwd.children].map(({ name, size, __typename }) => ({
                  name,
                  size,
                  type: __typename,
                }))
              : []
          }
          onDirectoryClick={(name) => cd({ variables: { dir: name } })}
        />
      </main>
    </div>
  );
}
