using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace Infrastructure.data.Interceptor
{
    public class AuditableEntityInterceptor : SaveChangesInterceptor
    {
        private readonly IUser _user;

        public AuditableEntityInterceptor(IUser user)
        {
            _user = user;
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            UpdateEntities(eventData.Context);

            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            UpdateEntities(eventData.Context);

            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        public void UpdateEntities(DbContext? context)
        {
            if (context == null) return;

            foreach (var entry in context.ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State is EntityState.Added or EntityState.Modified || entry.HasChangedOwnedEntities())

                {
                    if (entry.Entity is BaseEntity baseEntity)
                    {
                        if (entry.State == EntityState.Added)
                        {
                            baseEntity.Id = Guid.NewGuid().ToString();
                            baseEntity.created_by = _user.getCurrentUser();
                            baseEntity.created_at = DateTime.UtcNow;
                        }

                        if (entry.State == EntityState.Modified)
                        {
                            baseEntity.updated_by = _user.getCurrentUser();
                            baseEntity.last_updated = DateTime.UtcNow;
                        }
                    }
                }
                {
                    if (entry.State == EntityState.Added)
                    {
                        entry.Entity.Id = Guid.NewGuid().ToString();
                        entry.Entity.created_by = _user.getCurrentUser();
                        entry.Entity.created_at = DateTime.UtcNow;
                    }

                    if (entry.State == EntityState.Modified)
                    {
                        entry.Entity.updated_by = _user.getCurrentUser();
                        entry.Entity.last_updated = DateTime.UtcNow;
                    }
                }
            }
        }
    }




    public static class Extensions
    {
        public static bool HasChangedOwnedEntities(this EntityEntry entry) =>
            entry.References.Any(r =>
                r.TargetEntry != null &&
                r.TargetEntry.Metadata.IsOwned() &&
                (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
    }
}