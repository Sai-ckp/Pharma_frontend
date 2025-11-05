import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {user_devices} from './user_devices';

const meta: Meta<typeof user_devices> = {
  component: user_devices,
};

export default meta;

type Story = StoryObj<typeof user_devices>;

export const Basic: Story = {args: {}};
