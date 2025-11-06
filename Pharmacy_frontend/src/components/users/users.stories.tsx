import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {users} from './users';

const meta: Meta<typeof users> = {
  component: users,
};

export default meta;

type Story = StoryObj<typeof users>;

export const Basic: Story = {args: {}};
