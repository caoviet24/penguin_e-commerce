using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interface;
using Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.data.Interceptor
{
    public class EntityInterceptor : SaveChangesInterceptor
    {
        private readonly IUser _user;
        public EntityInterceptor(IUser user)
        {
            _user = user;
        }


        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            var entries = eventData.Context?.ChangeTracker?.Entries();
            if (entries == null) return result;
            foreach (var entry in entries)
            {
                if (entry.Entity is BaseEntity baseEntity)
                {
                    var user = _user.getCurrentUser();
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            baseEntity.Id = Guid.NewGuid().ToString();
                            baseEntity.created_at = DateTime.UtcNow;
                            baseEntity.last_updated = DateTime.UtcNow;
                            baseEntity.created_by = user;
                            baseEntity.updated_by = user;
                            break;
                        case EntityState.Modified:
                            baseEntity.last_updated = DateTime.UtcNow;
                            baseEntity.updated_by = user;
                            baseEntity.last_updated = DateTime.UtcNow;
                            break;
                    }
                }
            }
            return base.SavingChanges(eventData, result);
        }
    }
}