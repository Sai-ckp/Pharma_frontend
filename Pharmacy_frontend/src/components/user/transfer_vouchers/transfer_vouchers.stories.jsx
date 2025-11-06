import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {transfer_vouchers} from './transfer_vouchers';

const meta: Meta<typeof transfer_vouchers> = {
  component: transfer_vouchers,
};

export default meta;

type Story = StoryObj<typeof transfer_vouchers>;

export const Basic: Story = {args: {}};
