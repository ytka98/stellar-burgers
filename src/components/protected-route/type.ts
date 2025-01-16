import React from 'react';

export type ProtectedRouteProps = {
  GuestRoute?: boolean;
  children: React.ReactElement;
};
