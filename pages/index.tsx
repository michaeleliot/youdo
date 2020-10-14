import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Trello from '../components/Trello'
import taskdata from '../components/taskdata'
import okrdata from '../components/okrdata'
import { TextField, Typography } from '@material-ui/core'
import React from 'react'
import EditableLabel from 'react-inline-editing';
import { useSelector, useDispatch } from 'react-redux'
import { PrismaClient } from "@prisma/client";

import { initializeStore } from '../redux/store'
import { getSession, signIn, signOut, useSession } from "next-auth/client";
import column from '../components/column'

const prisma = new PrismaClient();

const useData = () => {
  const okrs = useSelector((state) => state.trello.okr)
  const tasks = useSelector((state) => state.trello.tasks)
  return { okrs, tasks }
}

const IndexPage = () => {
  const [session, loading] = useSession();
  const { okrs, tasks } = useData()


  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    console.log(session.user)
    return (
      <div>
        <div className={styles.container}>
          <Head>
            <title>YouDo</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Typography variant="h5"> What gets {session.user.name} up in the morning? </Typography>
          <EditableLabel
            text={"I prove myself everyday so that others can reimagine what is possible."}
            labelClassName='myLabelClass'
            inputClassName='myInputClass'
            inputWidth='100%'
            inputHeight='100%'
            inputMaxLength={50}
            inputMin
            onFocus={(text) => (console.log(text))}
            onFocusOut={(text) => (console.log(text))}
          />
          <Trello initialData={okrs} />
          <Trello initialData={tasks} />

          <footer className={styles.footer}>
          </footer>
        </div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  } else {
    return (
      <div>
        You are not logged in! <br />
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }
};

export default IndexPage;


export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const columnRequest = await prisma.column.findMany({
    where: {
      owner: { email: session.user.email },
    },
    include: {
      Task: true
    },
  })

  let columnOrder = [columnRequest.map(col => "column-" + col.id)]
  let columns = {}
  for (let col of columnRequest) {
    let name = "column-" + col.id
    columns[name] = col
    columns[name].taskIds = col.Task
    columns[name].name = name
  }
  let colTotalCount = columnRequest.length

  const intitialData = {
    tasks: {
      'task-1': { column: 'column-1', id: 'task-1', content: 'Take out the garbage' },
      'task-2': { column: 'column-1', id: 'task-2', content: 'Watch my favorite show' },
      'task-3': { column: 'column-1', id: 'task-3', content: 'Charge my phone' },
      'task-4': { column: 'column-1', id: 'task-4', content: 'Cook dinner' },
    },
    taskTotalCount: 4,
    columns,
    colTotalCount,
    columnOrder
  }

  console.log(intitialData.taskIds)

  let initData = {
    trello: {
      okr: intitialData,
      tasks: taskdata
    }
  }
  const reduxStore = initializeStore(initData)
  return { props: { initialReduxState: reduxStore.getState() } }
}