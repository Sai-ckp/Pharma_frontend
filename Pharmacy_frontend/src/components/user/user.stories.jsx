import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {user} from './user';

const meta: Meta<typeof user> = {
  component: user,
};

export default meta;

type Story = StoryObj<typeof user>;

export const Basic: Story = {args: {}};
