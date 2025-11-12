import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {payment_terms} from './payment_terms';

const meta: Meta<typeof payment_terms> = {
  component: payment_terms,
};

export default meta;

type Story = StoryObj<typeof payment_terms>;

export const Basic: Story = {args: {}};
