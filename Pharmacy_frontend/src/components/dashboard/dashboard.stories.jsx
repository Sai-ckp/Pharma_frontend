import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {dashboard} from './dashboard';

const meta: Meta<typeof dashboard> = {
  component: dashboard,
};

export default meta;

type Story = StoryObj<typeof dashboard>;

export const Basic: Story = {args: {}};
