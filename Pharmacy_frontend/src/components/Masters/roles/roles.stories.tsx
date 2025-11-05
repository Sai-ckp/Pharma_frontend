import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {roles} from './roles';

const meta: Meta<typeof roles> = {
  component: roles,
};

export default meta;

type Story = StoryObj<typeof roles>;

export const Basic: Story = {args: {}};
