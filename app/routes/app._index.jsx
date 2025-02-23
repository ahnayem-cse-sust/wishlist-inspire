import React from 'react';
import {
  Page,
  Card,
  DataTable,
  EmptyState,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useLoaderData } from "@remix-run/react";
import { formatDistanceToNow, parseISO} from 'date-fns';

export const loader = async ({ request }) => {
  const auth = await authenticate.admin(request);
  const shop = auth.session.shop;
  console.log('shop: -------> ', shop);

  const wishlistData = await db.wishlist.findMany({
    where: {
      shop: shop,
    },
    orderBy: {
      id: "asc",
    },
  });

  console.log('wishlisData: ------>',wishlistData);

  return Response.json(wishlistData);
};

export const action = async ({ request }) => {
  
};

export default function Index() {
  const wishlistData = useLoaderData();
  const wishlistArray = wishlistData.map((item) => {
    const createdAt = formatDistanceToNow(parseISO(item.createdAt), { addSuffix: true});
    return [item.customerId, item.productId, createdAt];
  });

  return (
    <Page title="Wishlist overview dashboard">
      <Card>
        {wishlistData.length > 0 ? (
          <DataTable
          columnContentTypes={[
            'text',
            'text',
            'text',
          ]}
          headings={[
            'Customer Id',
            'Product Id',
            'Created At',
          ]}
          rows={wishlistArray}
        />
        ) : (
          <EmptyState
            heading="Manage your inventory transfers"
            action={{content: 'Add transfer'}}
            secondaryAction={{
              content: 'Learn more',
              url: 'https://help.shopify.com',
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Track and receive your incoming inventory from suppliers.</p>
          </EmptyState>
        )}
        
      </Card>
    </Page>
  );
}
