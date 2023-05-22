import type { GetPositionsResponse, CategoryMap } from 'types/server';
import { z } from 'zod';
import { uniqueObjArray } from 'utils/common';
import { createTRPCRouter, publicProcedure } from 'server/api/trpc';

export const entitiesRouter = createTRPCRouter({
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany();
    return categories;
  }),
  getPositions: publicProcedure
    .input(z.object({ category: z.number().nonnegative() }))
    .query(async ({ ctx, input }) => {
      const positions = await ctx.prisma.menuPosition.findMany({
        where: { categoryId: input.category },
        include: {
          categoryMap: {
            include: {
              categoryDiscount: { select: { discountSize: true } },
              products: {
                include: {
                  ingredients: true,
                  toppings: true,
                  variations: true,
                },
              },
            },
          },
        },
      });

      const collections = positions.reduce<GetPositionsResponse>(
        (acc, currPosition) => {
          acc.menuPositions.push({
            ...currPosition,
            // Map & denormalize categoryMaps
            categoryMap: currPosition.categoryMap.map((ctgMap): CategoryMap => {
              // Map & denormalize products
              const positionProducts = ctgMap.products.map((product) => {
                // Map & denormalize ingredient
                const productIngredients = product.ingredients.map(
                  (ingredient) => {
                    // Save ingredients
                    acc.ingredients.push(ingredient);
                    return ingredient.id;
                  }
                );

                // Map & denormalize toppings
                const productToppings = product.toppings.map((toppings) => {
                  // Save toppings
                  acc.toppings.push(toppings);
                  return toppings.id;
                });

                // Save denormalized product
                acc.products.push({
                  ...product,
                  ingredients: productIngredients,
                  toppings: productToppings,
                });

                // Return id to map
                return product.id;
              });

              // Make denormalized categoryMap
              return {
                ...ctgMap,
                categoryDiscount: ctgMap.categoryDiscount?.discountSize || 0,
                products: positionProducts,
                defaultProduct: ctgMap.productId,
              };
            }),
          });
          return acc;
        },
        { menuPositions: [], products: [], ingredients: [], toppings: [] }
      );

      // Remove duplicates
      collections.ingredients = uniqueObjArray(collections.ingredients, 'id');
      collections.toppings = uniqueObjArray(collections.toppings, 'id');
      collections.products = uniqueObjArray(collections.products, 'id');

      return collections;
    }),
});
