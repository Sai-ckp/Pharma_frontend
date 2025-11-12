import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {billgeneration} from './billgeneration';

const meta: Meta<typeof billgeneration> = {
  component: billgeneration,
};

export default meta;

type Story = StoryObj<typeof billgeneration>;

export const Basic: Story = {args: {}};
