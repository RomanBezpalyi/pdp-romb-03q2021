import React, { Fragment } from 'react'

import { TaskTable } from '../features/tasks/components'

export const Home: React.FC = () => {
  return (
    <Fragment>
      <TaskTable />
    </Fragment>
  )
}
