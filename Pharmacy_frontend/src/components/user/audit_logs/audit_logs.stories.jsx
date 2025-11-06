import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {audit_logs} from './audit_logs';

const meta: Meta<typeof audit_logs> = {
  component: audit_logs,
};

export default meta;

type Story = StoryObj<typeof audit_logs>;

export const Basic: Story = {args: {}};
