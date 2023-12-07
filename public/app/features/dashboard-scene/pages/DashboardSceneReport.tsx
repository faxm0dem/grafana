// Libraries
import { css } from '@emotion/css';
import React, { useEffect, useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import PageLoader from 'app/core/components/PageLoader/PageLoader';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { DashboardPageRouteParams } from 'app/features/dashboard/containers/types';

import { DashboardScene } from '../scene/DashboardScene';

import { getDashboardScenePageStateManager } from './DashboardScenePageStateManager';

export interface Props extends GrafanaRouteComponentProps<DashboardPageRouteParams> {}

export function DashboardSceneReport({ match, route }: Props) {
  const stateManager = getDashboardScenePageStateManager();
  const { dashboard, isLoading, loadError } = stateManager.useState();

  useEffect(() => {
    stateManager.loadDashboard(match.params.uid!);

    return () => {
      stateManager.clearState();
    };
  }, [stateManager, match.params.uid, route.routeName]);

  if (!dashboard) {
    return (
      <div>
        {isLoading && <PageLoader />}
        {loadError && <h2>{loadError}</h2>}
      </div>
    );
  }

  return <DashbordReportRenderer model={dashboard} />;
}

interface RendererProps {
  model: DashboardScene;
}

function DashbordReportRenderer({ model }: RendererProps) {
  const [isActive, setIsActive] = useState(false);
  const { body } = model.useState();
  const styles = useStyles2(getStyles);

  useEffect(() => {
    setIsActive(true);
    return model.activate();
  }, [model]);

  if (!isActive) {
    return null;
  }

  return (
    <div className={styles.canvas}>
      <div className={styles.title}>{model.state.title}</div>

      <div className={styles.body}>
        <body.Component model={body} />
      </div>
    </div>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    canvas: css({
      label: 'canvas',
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
      flexGrow: 1,
      padding: theme.spacing(2),
    }),
    title: css({
      label: 'report-title',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 0,
    }),
    body: css({
      label: 'body',
      flexGrow: 1,
      display: 'flex',
      gap: '8px',
      marginBottom: theme.spacing(2),
    }),
  };
}

export default DashboardSceneReport;
