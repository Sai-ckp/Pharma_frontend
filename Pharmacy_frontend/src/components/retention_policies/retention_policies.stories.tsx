import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {retention_policies} from './retention_policies';

const meta: Meta<typeof retention_policies> = {
  component: retention_policies,
};

export default meta;

type Story = StoryObj<typeof retention_policies>;

export const Basic: Story = {args: {}};
