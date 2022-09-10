import { Box, Grid } from '@chakra-ui/layout';
import React, { ReactNode } from 'react';

import Navigation from '../components/Navigation';

interface LayoutProps {
  children?: ReactNode;
  fullHeight?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullHeight }) => (
  <Grid
    gridTemplateRows="auto 1fr"
    h={fullHeight && '100vh'}
    overflowY={fullHeight ? 'hidden' : 'auto'}
  >
    <Navigation />
    <Box as="main" overflowY="hidden">
      {children}
    </Box>
  </Grid>
);

export default Layout;
