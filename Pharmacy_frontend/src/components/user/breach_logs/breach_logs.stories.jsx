import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {breach_logs} from './breach_logs';

const meta: Meta<typeof breach_logs> = {
  component: breach_logs,
};

export default meta;

type Story = StoryObj<typeof breach_logs>;

export const Basic: Story = {args: {}};
