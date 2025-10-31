import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Unit} from './Unit';

const meta: Meta<typeof Unit> = {
  component: Unit,
};

export default meta;

type Story = StoryObj<typeof Unit>;

export const Basic: Story = {args: {}};
