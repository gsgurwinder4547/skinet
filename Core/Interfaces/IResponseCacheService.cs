namespace Core.Interfaces;

public interface IResponseCacheService
{
    Task CacheResponseAync(string cacheKey, object response, TimeSpan timeToLive);
    Task<string?> GetCachedResponseAsync(string cacheKey);
    Task RemoveCacheByPattern(string pattern);
}
